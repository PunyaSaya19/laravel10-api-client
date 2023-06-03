const base_api = "http://127.0.0.1:8000/api";

function callAjaxRequest(
  type,
  url,
  data,
  funSucc,
  funErr,
  bfSend = null,
  afSend = null,
  auth = true
) {
  // set header
  let headers = new Object();
  headers.Accept = "application/json";
  if (auth) {
    const token = getCookie("token");
    headers.Authorization = "Bearer " + token;
  }
  $.ajax({
    type: type,
    url: base_api + url,
    headers: headers,
    data: data,
    dataType: false,
    contentType: false,
    cache: false,
    processData: false,
    success: (res) => {
      funSucc(res);
    },
    error: (err) => {
      if (err.status == 401 || err.status == 403) {
        alert('Unauthenticated')
        window.location = 'login.html'
      } else {
        const res = err.responseJSON;
        funErr(res, err.responseText);
      }
    },
    beforeSend: () => {
      if (bfSend != null) {
        bfSend();
      }
    },
    complete: () => {
      if (afSend != null) {
        afSend();
      }
    },
  });
}

// cookie
function setCookie(cname, cvalue, exdays = 1) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function delCookie() {
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function logout() {
  delCookie()
  window.location = 'login.html'
}
