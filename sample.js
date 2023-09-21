(function () {
  "use strict";

  function encode() {
    var rec = kintone.app.record.get();
    var ssn = rec.record["ssn"].value;
    var email = rec.record["email"].value;
    var phone = rec.record["phone"].value;

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
      { "Content-Type": "application/json;charset=UTF-8" },
      dataTmpEn,
      function (respEn) {
        // success
        console.log(respEn);
        const r = JSON.parse(respEn);
        console.log(r);
        rec.record["ssn_after"].value = r.fields.ssn;
        rec.record["email_after"].value = r.fields.email;
        rec.record["phone_after"].value = r.fields.phone;
        kintone.app.record.set(rec);
      },
    );

    // kintone.proxy("http://221.168.38.75:4826/decrypt", "POST", headers, dataTmpDe, function (respDe) {
    //   // success
    //   console.log(respDe);
    // });
  }

  kintone.events.on(["app.record.create.show", "app.record.edit.show"], function (event) {
    var sourceCopyEn = document.createElement("button");
    sourceCopyEn.id = "space_field_buttonEn";
    sourceCopyEn.innerHTML = "[ エ ン コ ー ダ ー ]";
    sourceCopyEn.onclick = encode;
    kintone.app.record.getSpaceElement("space_field_encord").appendChild(sourceCopyEn);

    event.record["ssn_after"].disabled = true;
    event.record["email_after"].disabled = true;
    event.record["phone_after"].disabled = true;
    return event;
  });
})();
