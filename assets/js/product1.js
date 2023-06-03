// global variabel
const modalTambah = new bootstrap.Modal($("#modalTambah"));
const modalEdit = new bootstrap.Modal($("#modalEdit"));

// global function
function loading(show = false, text = "") {
  $("#loading-text").text(text);
  if (show) {
    $("#loading").removeClass("d-none");
  } else {
    $("#loading").addClass("d-none");
  }
}

// load data
$(document).ready(function () {
  loadData();
});
function loadData() {
  callAjaxRequest("GET", "/products", {}, succLoad, errLoad, bfLoad, afLoad);
}
function succLoad(res) {
  $("#product-table-body").empty();
  let tmplt = ``;
  res.data.forEach((dt, i) => {
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
                        <a href="#" class="btn btn-sm btn-danger m-1" onclick="confirmHapus(${dt.id})">
                            <i class="fas fa-trash"></i>
                        </a>
                    </td>
                </tr>
                `;
  });
  $("#product-table-body").html(tmplt);
}
function errLoad(res, resText) {
  console.log(resText)
  alert("gagal Load Data");
}
function bfLoad() {
  loading(true, "Sedang Mengambil Data...");
}
function afLoad() {
  loading(false);
}

// tambah data
$("#btnSubmitTambah").on("click", () => {
  $("#formTambah").submit();
});
$("#formTambah").on("submit", (e) => {
  e.preventDefault();
  let data = new FormData(document.getElementById("formTambah"));
  callAjaxRequest("POST", "/products", data, successTambah, errorTambah);
});
function successTambah(res) {
  if (res.status == true) {
    $("#alert_error_tambah").addClass("d-none");
    document.getElementById("formTambah").reset();
    modalTambah.hide();
    loadData();
  }
}
function errorTambah(res) {
  $("#alert_error_tambah").removeClass("d-none");
  $("#alert_error_tambah").text(res.errors);
}

// edit
function isiModalEdit(id) {
  callAjaxRequest("GET", "/products/" + id, {}, succEdit, errEdit);
}
function succEdit(res) {
  if (res.status == true) {
    modalEdit.show();
    const dt = res.data;
    $("#edit_id").val(dt.id);
    $("#edit_name").val(dt.name);
    $("#edit_description").val(dt.description);
    $("#edit_price").val(dt.price);
  } else {
    alert("Gagal Load Data");
  }
}
function errEdit(res) {
  console.log(res)
}

// update
$("#btnSubmitEdit").on("click", () => {
  $("#formEdit").submit();
});
$("#formEdit").on("submit", (e) => {
  e.preventDefault();
  let data = new FormData(document.getElementById("formEdit"));
  data.append('_method', 'PUT')
  callAjaxRequest("POST", "/products", data, successUpdate, errorUpdate);
});
function successUpdate(res) {
  if (res.status == true) {
    $("#alert_error_edit").addClass("d-none");
    document.getElementById("formEdit").reset();
    modalEdit.hide();
    loadData();
  }
}
function errorUpdate(res) {
  $("#alert_error_edit").removeClass("d-none");
  $("#alert_error_edit").text(res.errors);
}

// hapus
function confirmHapus(id) {
  if(confirm('Yakin Hapus??')) {
    let data = new FormData()
    data.append('_method', 'DELETE')
    callAjaxRequest('POST', '/products/' + id, data, succHapus, errHapus)
  }
}
function succHapus(res) {
  console.log(res)
  if(res.status) {
    loadData()
  }
}
function errHapus(res) {
  console.log(res)
}
