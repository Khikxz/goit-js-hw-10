import { fetchBreeds, fetchCatByBreed } from './cat-api';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const breedSelect = document.querySelector('.breed-select');
const catInfo = document.querySelector('.cat-info');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');

function chooseBreed(data) {
  fetchBreeds(data)
    .then(data => {
      loader.classList.replace('loader', 'is-hidden');

      let optionsMarkup = data.map(({ name, id }) => {
        return `<option value ='${id}'>${name}</option>`;
      });

      breedSelect.insertAdjacentHTML('beforeend', optionsMarkup);

      new SlimSelect({
        select: breedSelect,
      });
      breedSelect.classList.remove('is-hidden');

    })

    .catch(onError);
}

chooseBreed();

function createMarkup(event) {
    loader.classList.replace('is-hidden', 'loader');
    breedSelect.classList.add('is-hidden');
    catInfo.classList.add('is-hidden');
    const breedId = event.target.value;

  fetchCatByBreed(breedId)
    .then(data => {
        loader.classList.replace('loader', 'is-hidden');
        breedSelect.classList.remove('is-hidden');

        const { url, breeds } = data[0];
        const { name, description, temperament } = breeds[0];

        catInfo.innerHTML = `
            <img src="${url}" alt="${name}" width="400"/>
            <div class="box">
                <h2>${name}</h2>
                <p>${description}</p>
                <p><strong>Temperament:</strong> ${temperament}</p>
            </div>
        `;
        catInfo.classList.remove('is-hidden');
    })
    .catch(onError);
}

breedSelect.addEventListener('change', createMarkup);

function onError() {
  breedSelect.classList.remove('is-hidden');
  error.classList.replace('loader', 'is-hidden');

   Notify.failure(
    'Oops! Something went wrong! Try reloading the page or select another cat breed!'
  );
}
