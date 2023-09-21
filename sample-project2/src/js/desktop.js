(function (PLUGIN_ID) {
  "use strict";

  var config = kintone.plugin.app.getConfig(PLUGIN_ID);
  if (!config) return;

  async function getRole(code) {
    const resp = await kintone.api(kintone.api.url("/v1/user/groups.json"), "GET", { code: code });
    //spiceware_okロールがあるか確認
    console.log(resp);
    const r = resp.groups.find((group) => group.code === "spiceware_ok");
    return r ? true : false;
  }

  async function encode(rec) {
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

    const respEn = await kintone.proxy(
      "http://221.168.38.75:4826/encrypt",
      "POST",
      {
        "Content-Type": "application/json;charset=UTF-8",
      },
      dataTmpEn,
    );

    // success
    console.log(respEn);
    const r = JSON.parse(respEn[0]);
    console.log(r);
    config.ssn_encrypted ? (rec.record[config.ssn_encrypted].value = r.fields.ssn) : "";
    config.email_encrypted ? (rec.record[config.email_encrypted].value = r.fields.email) : "";
    config.phone_encrypted ? (rec.record[config.phone_encrypted].value = r.fields.phone) : "";
  }
  async function decode(rec) {
    var ssn = config.ssn ? rec.record[config.ssn_encrypted].value : "";
    var email = config.email ? rec.record[config.email_encrypted].value : "";
    var phone = config.phone ? rec.record[config.phone_encrypted].value : "";

    var dataTmpEn = {
      uri: "/spiceware/decrypt",
      ip: "172.16.0.12",
      fields: {
        ssn,
        email,
        phone,
      },
    };

    const respEn = await kintone.proxy(
      "http://221.168.38.75:4826/decrypt",
      "POST",
      {
        "Content-Type": "application/json;charset=UTF-8",
      },
      dataTmpEn,
    );
    // success
    console.log(respEn);
    const r = JSON.parse(respEn[0]);
    console.log(r);
    config.ssn_encrypted ? (rec.record[config.ssn_encrypted].value = r.fields.ssn) : "";
    config.email_encrypted ? (rec.record[config.email_encrypted].value = r.fields.email) : "";
    config.phone_encrypted ? (rec.record[config.phone_encrypted].value = r.fields.phone) : "";
  }

  kintone.events.on(["app.record.create.show", "app.record.edit.show"], async (event) => {
    event.record[config.ssn_encrypted].disabled = true;
    event.record[config.email_encrypted].disabled = true;
    event.record[config.phone_encrypted].disabled = true;
    const user = kintone.getLoginUser();
    if (await getRole(user.code)) {
      event.record[config.ssn_encrypted].disabled = false;
      event.record[config.email_encrypted].disabled = false;
      event.record[config.phone_encrypted].disabled = false;
      await decode(event);
    }
    return event;
  });
  kintone.events.on(["app.record.create.submit", "app.record.edit.submit"], async (event) => {
    await encode(event);
    return event;
  });
})(kintone.$PLUGIN_ID);
