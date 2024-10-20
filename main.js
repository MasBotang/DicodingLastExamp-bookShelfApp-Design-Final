document.addEventListener("DOMContentLoaded", function () {
    const submitForm = document.querySelector(".bookForm");
  
    submitForm.addEventListener("submit", function (event) {
      event.preventDefault();
      bookShelfApp();
    });
  });
  
  const bookShelfs = [];
  const RENDER_EVENT = "render-bookShelfs";
  
  function bookShelfApp() {
    const judul = document.getElementById("bookFormTitle");
    const penulis = document.getElementById("bookFormAuthor");
    const tahun = document.getElementById("bookFormYear");
    const selesai = document.getElementById("checkBox").checked;
  
    if (
      !judul ||
      !penulis ||
      !tahun ||
      !judul.value ||
      !penulis.value ||
      !tahun.value
    ) {
      console.error(
        "Salah satu atau lebih elemen tidak ditemukan atau input kosong!"
      );
      return;
    }
  
    const generatedID = generateID();
    const bookShelfObject = generateShelfObject(
      generatedID,
      judul.value,
      penulis.value,
      tahun.value,
      selesai
    );
  
    bookShelfs.push(bookShelfObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
  
    judul.value = "";
    penulis.value = "";
    tahun.value = "";
    document.getElementById("checkBox").checked = false;
  }
  
  function makeBookShelf(bookShelfObject) {
    const container = document.createElement("div");
    container.classList.add("item", "shadow");
    container.setAttribute("id", `todo-${bookShelfObject.id}`);
  
    const textJudul = document.createElement("h3");
    textJudul.innerHTML = bookShelfObject.judul;
    container.appendChild(textJudul);
  
    const textAuthor = document.createElement("p");
    textAuthor.innerHTML = `Penulis: ${bookShelfObject.penulis}`;
    container.appendChild(textAuthor);
  
    const textYear = document.createElement("p");
    textYear.innerHTML = `Tahun: ${bookShelfObject.tahun}`;
    container.appendChild(textYear);
  
    const completeButton = document.createElement("button");
    completeButton.innerHTML = "Tandai Selesai";
    completeButton.classList.add("btn");
    completeButton.addEventListener("click", function () {
      bookShelfObject.isCompleted = true; // Tandai buku sebagai selesai
      document.dispatchEvent(new Event(RENDER_EVENT));
    });
  
    const removeButton = document.createElement("button");
    removeButton.innerHTML = "Hapus Buku";
    removeButton.classList.add("btn");
    removeButton.addEventListener("click", function () {
      const index = bookShelfs.indexOf(bookShelfObject);
      if (index > -1) {
        bookShelfs.splice(index, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
      } else {
        console.error("Buku tidak ditemukan!");
      }
    });
  
    const editButton = document.createElement("button");
    editButton.innerHTML = "Edit Buku";
    editButton.classList.add("btn");
    editButton.addEventListener("click", function () {
      // Isi form dengan data buku yang ada
      document.getElementById("bookFormTitle").value = bookShelfObject.judul;
      document.getElementById("bookFormAuthor").value = bookShelfObject.penulis;
      document.getElementById("bookFormYear").value = bookShelfObject.tahun;
      document.getElementById("checkBox").checked = bookShelfObject.isCompleted;
  
      // Hapus buku yang sedang diedit dari daftar
      const index = bookShelfs.indexOf(bookShelfObject);
      if (index > -1) {
        bookShelfs.splice(index, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
      } else {
        console.error("Buku tidak ditemukan saat mencoba mengedit!");
      }
    });
  
    container.appendChild(completeButton);
    container.appendChild(removeButton);
    container.appendChild(editButton);
  
    return container;
  }
  
  document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookShelfList =
      document.getElementById("incompleteBookList");
    uncompletedBookShelfList.innerHTML = "";
  
    const completedBookShelfList = document.getElementById("completeBookList");
    completedBookShelfList.innerHTML = "";
  
    for (const bookShelfItem of bookShelfs) {
      const bookShelfElement = makeBookShelf(bookShelfItem);
      if (!bookShelfItem.isCompleted) {
        uncompletedBookShelfList.append(bookShelfElement);
      } else {
        completedBookShelfList.append(bookShelfElement);
      }
    }
  });
  
  function generateID() {
    return +new Date();
  }
  
  function generateShelfObject(id, judul, penulis, tahun, isCompleted) {
    return { id, judul, penulis, tahun, isCompleted };
  }
  const inputSearch = document.getElementById("searchBookTitle");
  const buttonSubmit = document.getElementById("searchSubmit");
  
  buttonSubmit.addEventListener("click", function (event) {
    const searchTerm = inputSearch.value.toLowerCase(); // Ambil nilai input dan ubah ke huruf kecil
    const resultContainer = document.getElementById("resultContainer"); // Pastikan ada elemen untuk menampilkan hasil
    event.preventDefault();
  
    // Loop melalui semua buku di bookShelfs
    bookShelfs.forEach((bookShelfObject) => {
      if (bookShelfObject.judul.toLowerCase().includes(searchTerm)) {
        // Jika judul buku mencocokkan dengan input pencarian, buat elemen untuk menampilkannya
        const bookElement = makeBookShelf(bookShelfObject); // Gunakan fungsi makeBookShelf untuk membuat elemen
        resultContainer.appendChild(bookElement); // Tambahkan elemen buku ke hasil pencarian
      }
    });
  
    // Jika tidak ada hasil
    if (resultContainer.children.length === 0) {
      const noResult = document.createElement("p");
      noResult.innerText = "Buku tidak ditemukan!";
      resultContainer.appendChild(noResult);
    }
  });
  
  buttonSubmit.addEventListener("click", function (event) {
    event.preventDefault();
  
    const searchTerm = inputSearch.value.toLowerCase();
    const resultContainer = document.getElementById("resultContainer");
  
    resultContainer.innerHTML = "";
  
    bookShelfs.forEach((bookShelfObject) => {
      if (bookShelfObject.judul.toLowerCase().includes(searchTerm)) {
        const bookElement = makeBookShelf(bookShelfObject);
        bookElement.classList.add("containerBookList");
        bookElement.style.margin = "1.5rem";
        resultContainer.appendChild(bookElement);
      }
    });
  
    if (resultContainer.children.length === 0) {
      const noResult = document.createElement("p");
      noResult.innerText = "Buku tidak ditemukan!";
      resultContainer.appendChild(noResult);
    }
  });
  
