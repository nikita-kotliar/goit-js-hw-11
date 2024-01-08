import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.form');
const input = document.querySelector('#input');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
loader.style.display = 'none';

let modal = new simpleLightbox('ul.gallery a', {
  captionDelay: 250,
  captionsData: 'alt',
});

form.addEventListener('submit', event => {
  event.preventDefault();
  const query = input.value.trim();
  gallery.innerHTML = '';
  input.value = '';
  loader.style.display = 'block';

  const searchParams = new URLSearchParams({
    key: '41708533-f63d2cf4b74729d1361203347',
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });

  fetch(`https://pixabay.com/api/?${searchParams}`)
    .then(response => {
      loader.style.display = 'none';
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(data => {
      if (data.hits.length === 0) {
        throw iziToast.show({
          message:
            'Sorry, there are no images matching your search query. Please try again!',
          theme: 'dark',
          backgroundColor: '#EF4040',
          titleColor: 'white',
          position: 'topRight',
        });
      }
      const imgs = data.hits.reduce(
        (
          html,
          {
            webformatURL,
            largeImageURL,
            tags,
            likes,
            views,
            comments,
            downloads,
          }
        ) =>
          html +
          `<li class="gallery-item">
          <a class="gallery-link" href="${largeImageURL}">
           <img class="gallery-image"
           src="${webformatURL}"
           alt="${tags}"
           />
          </a>          
          <div class="description">
          <p><b>Likes:</b><span>${likes}</span></p>
          <p><b>Views:</b><span>${views}</span></p>
          <p><b>Comments:</b><span>${comments}</span></p>
          <p><b>Downloads:</b><span>${downloads}</span></p>
          </div> 
        </li>`,
        ''
      );
      gallery.insertAdjacentHTML('beforeend', imgs);

      modal.refresh();
    })
    .catch(error => {
      loader.style.display = 'none';
      iziToast.error({
        message: error.message,
        color: 'red',
        position: 'topCenter',
      });
      console.error('Error fetching data:', error);
    });
});
