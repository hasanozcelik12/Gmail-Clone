// yazıları kesemk için kullandığımız fonk.
function trimString(str, max) {
  // metin 50 karakterden kısaysa olduğu gibi gönderiyorux
  if (str.length < max) return str;

  // metnin harf uzunluğu 50 karakterden uzunsa
  // 50 ye kadar olan kısmı kes sonrasına ... koy
  // yeni metni fonksiyonun çalıştırıldığı yere gönder
  return str.slice(0, max) + '...';
}

/*
 * Ekrana mailleri listeleyecek fonksiyon
 * Outlet: ekranın hangi kısmına müdahale edilcek
 * Data: Hangi verileri ekrana basıcaz
 */
export function renderMails(outlet, data) {
  if (!data) return;
  // herbir mail objesi için bir maili temsil eden html oluştur
  // oluşan mail html'ini Mailler alanına gönder (ekran bas)
  outlet.innerHTML = data
    .map(
      (mail) => `
         <div class="mail" data-id =${mail.id}>
            <div class="left">
              <input type="checkbox" />
              <i id="star" class="bi bi-star ${
                mail.stared && "star-active" 
              }"></i>
              <span>${mail.sender}</span>
            </div>
            <div class="right">
              <p class="message-title">${trimString(
                mail.title,
                30
              )}</p>
              <p class="message-desc">
                ${trimString(mail.message, 40)}
              </p>
              <p class="message-date">${mail.date}</p>

              <button id="delete">Sil</button>
            </div>
          </div>
  `
    )
    .join(' ');
}

// ekrana mail oluşturma penceri açıcak fonk.
export function showModal(modal, willOpen) {
  modal.style.display = willOpen ? 'grid' : 'none';
}

// Katwgorileri ekrana basma methodu
export function renderCategories(outlet,data,selectedCategory) {
// eski kategorileri sil
outlet.innerHTML='';

  // bize gelen diziyi dönme
 data.forEach((category) => {
  const categoryItem =document.createElement('a');
  // kategori elemanına veri ekleme 
  categoryItem.dataset.name = category.title;
  // aktif olan kategoriye active classı ekle
  categoryItem.className = selectedCategory === category.title && 'active-category';
  
  categoryItem.innerHTML =`
  <i class="${category.class}"> <i/>
  <span>${category.title}</span>
  `
  outlet.appendChild(categoryItem);
 })
}
