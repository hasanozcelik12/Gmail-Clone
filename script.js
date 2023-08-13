//! importlar (diğer js dosyasında gelen değişken ve fonksiyonlar)
import { months,categories } from './constants.js';
import { renderMails, showModal,renderCategories } from './ui.js';

// localstorage'dan veri alma
const strMailData = localStorage.getItem('data');
// gelen string veriyi obje ve dizileri çevirme
const mailData = JSON.parse(strMailData ) || [] ;

//! HTML'den gelenler
const hamburgerMenu = document.querySelector('.menu');
const navigation = document.querySelector('nav');
const mailsArea = document.querySelector('.mails-area');
const createMailBtn = document.querySelector('.create-mail');
const closeMailBtn = document.querySelector('#close-btn');
const modal = document.querySelector('.modal-wrapper');
const form = document.querySelector('#create-mail-form');
const categoryArea = document.querySelector('nav .middle')
const searchButton = document.querySelector('#search-icon')
const searchInput = document.querySelector('#search-input')


//! Olay İzleyicleri
// ekranın yüklnme anında çalışır
document.addEventListener('DOMContentLoaded', () => {
  renderCategories(categoryArea,categories,"Gelen Kutusu")
  renderMails(mailsArea, mailData)
  if(window.innerWidth < 1100) {
    navigation.classList.add('hide')
  } else {
    navigation.classList.remove('hide')
  }
 
});
// pencerenin genişliğinin değişimini izleme
window.addEventListener('resize',(e) => {
  const width = e.target.innerWidth
  if(width < 1100) {
    navigation.classList.add('hide')
  } else {
    navigation.classList.remove('hide')
  }
});

hamburgerMenu.addEventListener('click', handleMenu);

searchButton.addEventListener('click',searchMails)


// modal işlemleri
createMailBtn.addEventListener('click', () => showModal(modal, true));
closeMailBtn.addEventListener('click', () => showModal(modal, false));
form.addEventListener('submit', sendMail);

// mail alanında olan tıklamalar
mailsArea.addEventListener('click',updateMail)

// Sidebar  alanındaki tıklamalar
categoryArea.addEventListener('click',watchCategory)

//! Fonksiyonlar
// Navigasyonu açıp kapamaya yarayan fonksiyon
// Hamburger menüsüne tıklanınca çalışır
function handleMenu() {
  /*
     classList.toggle():
     * ona parametre olrak verdiğimiz class
     * yoksa ekler varsa çıkarır
    */
  navigation.classList.toggle('hide');
}

// tarih oluşturan fonksiyon
function getDate() {
  // bugünün tarihini alma
  const dateArr = new Date().toLocaleDateString().split('.');
  // tarih dizisinden günü alma
  const day = dateArr[0];
  // tarih diizisnde kaçıncı ayda olduğumuz bilgisini alma
  const monthNumber = dateArr[1];
  // ayın sırasına karşılık gelen ismi tanımladık
  const month = months[monthNumber - 1];
  // fonksiyonun çağrıldığı yere gönderilcek cevap
  return day + ' ' + month;
}


function sendMail(e) {
  // sayfanın yenilenmesini engelleme
  e.preventDefault();

  // formun içerisinde yer alan inputların
  // değerlerine erişme
  const receiver = e.target[0].value;
  const title = e.target[1].value;
  const message = e.target[2].value;

 if(!receiver || !title || !message) {
  // Notifikayon ver
  Toastify({
    text:'Lütfen formu doldurun',
    close: true,
    gravity :'top',
    position : 'right',
    stopOnFocus: true,
    duration: 3000,
    style: {
      background: "rgb(193,193,0)",
      borderRadius:"4px"
    },
  }).showToast()

  // Alttaki kodların çalışmasını engelle
  return;

 }



  // yeni mail objesi oluşturma
  const newMail = {
    id: new Date().getTime(),
    sender: 'Hasan',
    receiver,
    title,
    message,
    stared:false,
    date: getDate(),
  };

  // oluştudupğumuz objeyi dizinin başına ekleme
  mailData.unshift(newMail);

  //Todo veritabanını(localstorage) güncelle
  // storage'a gönderimek için string'e çeviriyoruz
  const strData = JSON.stringify(mailData);
  // storeage'a gönderme
  localStorage.setItem('data', strData);

  // ekranı güncelle
  renderMails(mailsArea, mailData);

  // modalı kapat
  showModal(modal, false);

  // modal'ı temizle
  e.target[0].value = ' ';
  e.target[1].value = ' ';
  e.target[2].value = ' ';
// Notifikasyon ver 
  Toastify({
    text:'Mail başarıyla gönderildi',
    close: true,
    gravity :'top',
    position : 'right',
    stopOnFocus: true,
    duration: 3000,
    style: {
      background: "#7CFC00",
      borderRadius:"4px",
      color : 'white'
    },
  }).showToast()
}

// Mail alanında bir  tıklanma olduğunda çalışır.
function updateMail(e) {
  // Sil butonuna tıklanınca çalışır.
if(e.target.id === 'delete'){
 
 // Sileceğimiz elemanı belirleme
  const mail = e.target.parentElement.parentElement
  //! maili HTML den  kaldırır
  mail.remove() ;

    //! localStorage dan kaldır
    // silinecek elemanın id'sini alma
    const mailId = mail.dataset.id
    // id değerini bildiğimiz elemanı diziden çıkarma
   const filteredData = mailData.filter((i) => i.id != mailId)
  //  diziyi stringe çevirme
   const strData = JSON.stringify(filteredData)
  //  localStorage'a gönderme
   localStorage.setItem('data',strData)
}
// Yıldıza tıklanınca çalışır
if(e.target.id === 'star') {
// güncellenecek maili belirleme
  const mail = e.target.parentElement.parentElement
  // mailin dizideki verilerini bulmak için id sine erişme
  const mailId = mail.dataset.id
  // İd sinden yola çıkarak mail objesini bulma
  const foundItem= mailData.find((i) => i.id == mailId);
  // bulduğumuz elemanın değerini tersine çevirme
  const updatedItem ={...foundItem ,stared:!foundItem.stared};
  // Güncellenecek elemanın sırasını bulma
  const index = mailData.findIndex((i) => i.id == mailId)
  // dizideki elemanı güncelleme
  mailData[index] = updatedItem

  // local storage'ı güncelleme
  localStorage.setItem('data',JSON.stringify(mailData));
  

renderMails(mailsArea,mailData)

}
}

// Katwgorileri izleyip değiştireceğimiz fonksiyon
function watchCategory(e){
  const selectedCategory = e.target.dataset.name
  renderCategories(categoryArea,categories,selectedCategory) 
    if(selectedCategory === 'Yıldızlı') {
      // stared değeri true olanları seçme
    const filtred = mailData.filter((i) => i.stared === true) 
    // Seçtiklerimizi ekrana basma
    renderMails(mailsArea,filtred);
    return
    }

    renderMails(mailsArea,mailData)
  
}

// mail Arama
function searchMails() {
  // Arama terimini içeren mailleri alma
const filtred = mailData.filter((i) => i.message.toLowerCase().includes(searchInput.value.toLowerCase()))
// Mailleri ekrana basma
renderMails(mailsArea,filtred)
}