import dateFormat from 'dateformat';
import validation from './validation';

export default class Timeline {
  constructor() {
    this.line = document.querySelector('.line');
    this.postText = document.querySelector('.post_text_input');
    this.geoModal = document.querySelector('.modal_geolocation_warn');
    this.geoInput = document.querySelector('.geolocation_input');
    this.geoForm = document.querySelector('.location_form');
    this._validation = validation;

    this._lineHeight();
    this._windowResize();
  }

  _lineHeight() {
    let liineHeight = 0;
    document.querySelectorAll('.post').forEach((el) => { liineHeight += el.offsetHeight + 20; });
    this.line.style.height = `${liineHeight - 50}px`;
  }

  _windowResize() {
    window.addEventListener('resize', () => { this._lineHeight(); });
  }

  _createPost(data) {
    const post = document.createElement('article');
    const {
      latitude,
      longitude,
      timestamp,
      text,
    } = data;

    post.className = 'post';
    post.innerHTML = `
      <div class="timeline_progress">
        <div class="point"></div>
      </div>
      <div class="main_post">
        <header class="timestamp">${dateFormat(timestamp, 'HH:MM  dd.mm.yyyy')}</header>
        <div class="post_text">${text}</div>
        <div class="geolocation">
          <div class="coordinates">[${latitude} ${longitude}]</div>
          <div class="show_hide"></div>
        </div>
      </div>
    `;

    document.querySelector('.line').after(post);
  }

  _getGeo(callback, error) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(callback, error);
    }
  }

  _openCloseModal() {
    this.geoModal.classList.toggle('active');
    this.geoInput.value = '';
  }

  _cancelModal() {
    document.querySelector('.cancel_btn').addEventListener('click', (e) => {
      e.preventDefault();

      this._openCloseModal();
    });
  }

  _submitModal() {
    document.querySelector('.ok_btn').addEventListener('click', (e) => {
      e.preventDefault();

      if (!this._validation(this.geoInput)) {
        const coordRegExp = /[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)/g;

        const latitude = this.geoInput.value.match(coordRegExp)[0];
        const longitude = this.geoInput.value.match(coordRegExp)[1];
        const timestamp = this._getTimeStamp();
        const text = this.postText.value;

        this._createPost({
          latitude,
          longitude,
          timestamp,
          text,
        });
        this._openCloseModal();
        this._lineHeight();
        this.postText.value = '';
      }
    });
  }

  _getTimeStamp() {
    const now = new Date();
    return dateFormat(now, 'HH:MM  dd.mm.yyyy');
  }

  savePost() {
    this._cancelModal();
    this._submitModal();

    this.postText.addEventListener('keypress', (e) => {
      if (e.which === 13 && !e.shiftKey) {
        e.preventDefault();

        if (!this.postText.value.trim()) {
          return;
        }

        const callback = (data) => {
          const { latitude, longitude } = data.coords;
          const { timestamp } = data;
          const text = this.postText.value.trim();

          this._createPost({
            latitude,
            longitude,
            timestamp,
            text,
          });
          this._lineHeight();
          this.postText.value = '';
        };

        const error = () => {
          this._openCloseModal();
        };

        this._getGeo(callback, error);
      }
    });
  }
}
