// login
$("#formLogin").on("submit", (e) => {
  e.preventDefault();
  let data = new FormData(document.getElementById("formLogin"));
  $.ajax({
    url: base_api + "/login",
    type: "POST",
    headers: {
      Accept: "application/json",
    },
    data: data,
    dataType: false,
    contentType: false,
    cache: false,
    processData: false,
    success: (res) => {
        if(res.status) {
          console.log(res.data.token)
          setCookie('token', res.data.token);
          window.location = 'product.html'
        }
    },
    error: (err) => {
      console.log(err.status);
      const res = err.responseJSON;
      if (res.errors) {
        $("#alert_login").removeClass("d-none");
        $("#alert_login").text(res.errors);
      }
    },
  });
});
