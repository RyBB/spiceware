(async (PLUGIN_ID) => {
  "use strict";
  try {
    const fieldList = await KintoneConfigHelper.getFields();
    console.log(fieldList);
    const html = fieldList
      .filter((field) => field.code)
      .map((field) => {
        return `<option value="${field.code}">${field.code}(${field.label})</option>`;
      })
      .join("");
    const ssnSelectDom = document.getElementById("ssn");
    const emailSelectDom = document.getElementById("email");
    const phoneSelectDom = document.getElementById("phone");
    const ssn_encryptedSelectDom = document.getElementById("ssn_encrypted");
    const email_encryptedSelectDom = document.getElementById("email_encrypted");
    const phone_encryptedSelectDom = document.getElementById("phone_encrypted");

    ssnSelectDom.innerHTML = `<option value="">---</option>${html}`;
    emailSelectDom.innerHTML = `<option value="">---</option>${html}`;
    phoneSelectDom.innerHTML = `<option value="">---</option>${html}`;
    ssn_encryptedSelectDom.innerHTML = `<option value="">---</option>${html}`;
    email_encryptedSelectDom.innerHTML = `<option value="">---</option>${html}`;
    phone_encryptedSelectDom.innerHTML = `<option value="">---</option>${html}`;

    // show Event
    const config = kintone.plugin.app.getConfig(PLUGIN_ID);
    if (config) {
      ssnSelectDom.value = config.ssn;
      emailSelectDom.value = config.email;
      phoneSelectDom.value = config.phone;
      ssn_encryptedSelectDom.value = config.ssn_encrypted;
      email_encryptedSelectDom.value = config.email_encrypted;
      phone_encryptedSelectDom.value = config.phone_encrypted;
    }

    // submit Event
    document.getElementById("submit").onclick = async () => {
      const obj = {
        ssn: ssnSelectDom.value,
        email: emailSelectDom.value,
        phone: phoneSelectDom.value,
        ssn_encrypted: ssn_encryptedSelectDom.value,
        email_encrypted: email_encryptedSelectDom.value,
        phone_encrypted: phone_encryptedSelectDom.value,
      };
      kintone.plugin.app.setConfig(obj);
    };

    // cancel Event
    document.getElementById("cancel").onclick = async () => {
      history.back();
    };
  } catch (err) {
    console.error(err);
  }
})(kintone.$PLUGIN_ID);
