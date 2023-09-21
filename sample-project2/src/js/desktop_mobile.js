(function (PLUGIN_ID) {
  "use strict";

  var config = kintone.plugin.app.getConfig(PLUGIN_ID);
  if (!config) return;

  function encode() {
    var rec = kintone.app.record.get();
    var ssn = config.ssn ? rec.record[config.ssn].value : "";
    var email = config.email ? rec.record[config.email].value : "";
    var phone = config.phone ? rec.record[config.phone].value : "";

    var dataTmpEn = {
      uri: "/spiceware/encrypt",
      ip: "172.16.0.12",
      fields: {
        ssn,
        email,
        phone,
      },
    };

    kintone.proxy(
      "http://221.168.38.75:4826/encrypt",
      "POST",
      {
        "Content-Type": "application/json;charset=UTF-8",
      },
      dataTmpEn,
      function (respEn) {
        // success
        console.log(respEn);
        const r = JSON.parse(respEn);
        console.log(r);
        config.ssn_encrypted ? (rec.record[config.ssn_encrypted].value = r.fields.ssn) : "";
        config.email_encrypted ? (rec.record[config.email_encrypted].value = r.fields.email) : "";
        config.phone_encrypted ? (rec.record[config.phone_encrypted].value = r.fields.phone) : "";
        kintone.app.record.set(rec);
      },
    );

    // kintone.proxy("http://221.168.38.75:4826/decrypt", "POST", headers, dataTmpDe, function (respDe) {
    //   // success
    //   console.log(respDe);
    // });
  }

  kintone.events.on(["mobile.app.record.create.show", "mobile.app.record.edit.show"], function (event) {
    var sourceCopyEn = document.createElement("button");
    sourceCopyEn.id = "space_field_buttonEn";
    sourceCopyEn.innerHTML = "Encrypt!";
    sourceCopyEn.onclick = encode;
    kintone.mobile.app.record.getSpaceElement("space_field_encord").appendChild(sourceCopyEn);
    return event;
  });
})(kintone.$PLUGIN_ID);
