const base_api = "http://127.0.0.1:8000/api";
const modalTambah = new bootstrap.Modal($("#modalTambah"));
const modalEdit = new bootstrap.Modal($("#modalEdit"));

// functions
function tampilData(data) {
  $("#product-table-body").empty();
  let tmplt = ``;
  data.forEach((dt, i) => {
    tmplt += `
                <tr>
                    <th class="text-center">
                        ${i + 1}
                    </th>
                    <td>
                        ${dt.name}
                    </td>
                    <td class="text-center">
                        <img src="${dt.photo}" alt="Product Image"
                            style="width: 100px;">
                    </td>
                    <td>
                        Rp. ${dt.price}
                    </td>
                    <td class="text-center">
                        <a href="" class="btn btn-sm btn-info m-1">
                            <i class="fas fa-search"></i>
                        </a>
                        <a href="#" class="btn btn-sm btn-primary m-1" 
                        onclick="isiModalEdit(${dt.id})">
                            <i class="fas fa-pen"></i>
                        </a>
                        <a href="" class="btn btn-sm btn-danger m-1">
                            <i class="fas fa-trash"></i>
                        </a>
                    </td>
                </tr>
                `;
  });
  $("#product-table-body").html(tmplt);
}

function loading(show = false, text = "") {
  $("#loading-text").text(text);
  if (show) {
    $("#loading").removeClass("d-none");
  } else {
    $("#loading").addClass("d-none");
  }
}

function loadData() {
  $.ajax({
    url: base_api + "/products",
    type: "GET",
    data: {},
    success: (res) => {
      tampilData(res.data);
    },
    error: (err) => {
      console.log(err);
    },
    beforeSend: () => {
      loading(true, "Sedang Mengambil Data...");
    },
    complete: () => {
      loading(false);
    },
  });
}

function displayErrorTambah(errors) {
  $("#alert_error_tambah").removeClass("d-none");
  $("#alert_error_tambah").text(errors);
}

function displayErrorEdit(errors) {
  $("#alert_error_edit").removeClass("d-none");
  $("#alert_error_edit").text(errors);
}

function clearModalTambah() {
  $("#alert_error_tambah").addClass("d-none");
  document.getElementById("formTambah").reset();
  modalTambah.hide();
}

function isiModalEdit(id) {
  $.ajax({
    url: base_api + "/products/" + id,
    type: "GET",
    data: {
      id: id
    },
    success: (res) => {
      if(res.status == true) {
        modalEdit.show()
        const dt = res.data
        $('#edit_id').val(dt.id)
        $('#edit_name').val(dt.name)
        $('#edit_description').val(dt.description)
        $('#edit_price').val(dt.price)
      } else {
        alert('Gagal Load Data')
      }
    },
    error: (err) => {
      console.log(err.responseText)
    },
    beforeSend: () => {
      loading(true, "Sedang Mengambil Data...");
    },
    complete: () => {
      loading(false);
    },
  });
}

// actions
$("#btnSubmitTambah").on("click", () => {
  $("#formTambah").submit();
});

$("#btnSubmitEdit").on("click", () => {
  $("#formEdit").submit();
});

$("#formTambah").on("submit", (e) => {
  e.preventDefault();
  let data_insert = new FormData(document.getElementById("formTambah"));
  console.log(data_insert)
  $.ajax({
    url: base_api + "/products",
    type: "POST",
    data: data_insert,
    dataType: "json",
    contentType: false,
    cache: false,
    processData: false,
    success: (res) => {
      console.log(res)
      if (res.status == true) {
        clearModalTambah();
        loadData();
      }
    },
    error: (err) => {
      displayErrorTambah(err.responseJSON.errors);
    },
    beforeSend: () => {
      loading(true, "Sedang Menambah Data...");
    },
    complete: () => {
      loading(false);
    },
  });
});

$("#formEdit").on("submit", (e) => {
  e.preventDefault();
  let data = new FormData(document.getElementById("formEdit"));
  

  $.ajax({
    url: base_api + "/products",
    type: "POST",
    data: data,
    dataType: "json",
    success: (res) => {
      console.log(res)
      // if (res.status == true) {
      //   console.log(res)
      // }
    },
    error: (err) => {
      console.log(err)
      displayErrorEdit(err.responseJSON);
    },
    beforeSend: () => {
      loading(true, "Sedang Mengupdate Data...");
    },
    complete: () => {
      loading(false);
    },
  });
});

$(document).ready(function () {
  loadData();
});
