class LinkData {
  constructor({ data }) {

    this.data = {
      a: data.a || '',
      image: data.image || '',
      title: data.title || '',
      description: data.description || '',
      source: data.source || ''
      // withBorder: data.withBorder !== undefined ? data.withBorder : false,
      // withBackground: data.withBackground !== undefined ? data.withBackground : false,
      // stretched: data.stretched !== undefined ? data.stretched : false,
    };

    this.wrapper = undefined;
    this.settings = [
      {
        name: 'withBorder',
        icon: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15.8 10.592v2.043h2.35v2.138H15.8v2.232h-2.25v-2.232h-2.4v-2.138h2.4v-2.28h2.25v.237h1.15-1.15zM1.9 8.455v-3.42c0-1.154.985-2.09 2.2-2.09h4.2v2.137H4.15v3.373H1.9zm0 2.137h2.25v3.325H8.3v2.138H4.1c-1.215 0-2.2-.936-2.2-2.09v-3.373zm15.05-2.137H14.7V5.082h-4.15V2.945h4.2c1.215 0 2.2.936 2.2 2.09v3.42z"/></svg>`
      },
      {
        name: 'stretched',
        icon: `<svg width="17" height="10" viewBox="0 0 17 10" xmlns="http://www.w3.org/2000/svg"><path d="M13.568 5.925H4.056l1.703 1.703a1.125 1.125 0 0 1-1.59 1.591L.962 6.014A1.069 1.069 0 0 1 .588 4.26L4.38.469a1.069 1.069 0 0 1 1.512 1.511L4.084 3.787h9.606l-1.85-1.85a1.069 1.069 0 1 1 1.512-1.51l3.792 3.791a1.069 1.069 0 0 1-.475 1.788L13.514 9.16a1.125 1.125 0 0 1-1.59-1.591l1.644-1.644z"/></svg>`
      },
      {
        name: 'withBackground',
        icon: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.043 8.265l3.183-3.183h-2.924L4.75 10.636v2.923l4.15-4.15v2.351l-2.158 2.159H8.9v2.137H4.7c-1.215 0-2.2-.936-2.2-2.09v-8.93c0-1.154.985-2.09 2.2-2.09h10.663l.033-.033.034.034c1.178.04 2.12.96 2.12 2.089v3.23H15.3V5.359l-2.906 2.906h-2.35zM7.951 5.082H4.75v3.201l3.201-3.2zm5.099 7.078v3.04h4.15v-3.04h-4.15zm-1.1-2.137h6.35c.635 0 1.15.489 1.15 1.092v5.13c0 .603-.515 1.092-1.15 1.092h-6.35c-.635 0-1.15-.489-1.15-1.092v-5.13c0-.603.515-1.092 1.15-1.092z"/></svg>`
      }
    ];

    this.details = null;
    this.leftDetails = null;
    this.rightDetails = null;
    this.imageDetail = null;
    this.titleDetail = null;
    this.descriptionDetail = null;
    this.sourceDetail = null;
  }
  static get toolbox() {
    return {
      title: 'Link',
      icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>'
    };
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('link-container');
    this.details = document.createElement('a');
    this.details.classList.add('link-details');
    this.leftDetails = document.createElement('div');
    this.leftDetails.classList.add('left-details');
    this.rightDetails = document.createElement('div');
    this.rightDetails.classList.add('right-details');
    this.imageDetail = document.createElement('img');
    this.titleDetail = document.createElement('h3');
    this.descriptionDetail = document.createElement('p');
    this.sourceDetail = document.createElement('span');

    const input = document.createElement('input');

    this.imageDetail.src = this.data.image || '';
    this.titleDetail.innerText = this.data.title || '';
    this.descriptionDetail.innerText = this.data.description || '';
    this.sourceDetail.innerText = this.data.source || '';

    if (this.data && this.data.a) {
      this._createImage(this.data.a, this.data.caption);
      return this.wrapper;
    }

    input.placeholder = 'Paste an URL...';
    input.addEventListener('paste', (event) => {
      this._createImage(event.clipboardData.getData('text'));
    });

    this.wrapper.appendChild(input);
    this.leftDetails.appendChild(this.titleDetail);
    this.leftDetails.appendChild(this.descriptionDetail);
    this.leftDetails.appendChild(this.sourceDetail);

    this.rightDetails.appendChild(this.imageDetail);
    this.details.appendChild(this.leftDetails);
    this.details.appendChild(this.rightDetails);

    if(this.data.a){
      this.wrapper.appendChild(this.details);
      input.style.display = "none";
    }

    return this.wrapper;
  }

  _createImage(url, captionText) {

    const data = fetch(`https://urlinfo.herokuapp.com/urlInfo/id?url=${url}`)
      .then((res) => res.json())
      .then(data => {
        this.details.href = data.url;

        this.imageDetail.src = data.image;
        this.titleDetail.innerHTML = data.title;
        this.descriptionDetail.innerHTML = data.description;
        this.sourceDetail.innerHTML = data.source;

        this.leftDetails.appendChild(this.titleDetail);
        this.leftDetails.appendChild(this.descriptionDetail);
        this.leftDetails.appendChild(this.sourceDetail);

        this.rightDetails.appendChild(this.imageDetail);

        this.details.appendChild(this.leftDetails);
        this.details.appendChild(this.rightDetails);

        this.wrapper.innerHTML = '';
        this.wrapper.appendChild(this.details);
      })


    this._acceptTuneView();
  }
  save(blockContent) {
    const a = blockContent.querySelector('a');
    const image = blockContent.querySelector('img');
    const title = blockContent.querySelector('h3');
    const description = blockContent.querySelector('p');
    const source = blockContent.querySelector('span');

    return Object.assign(this.data, {
      a: a?.href || "",
      image: image?.src || "",
      title: title?.innerText || "",
      description: description?.innerText || "",
      source: source?.innerText || ""
    });
  }

  // validate(savedData) {
  //   if (!savedData.url.trim()) {
  //     return false;
  //   }

  //   return true;
  // }

  renderSettings() {
    const wrapper = document.createElement('div');

    this.settings.forEach(tune => {
      let button = document.createElement('div');

      button.classList.add('cdx-settings-button');
      button.classList.toggle('cdx-settings-button--active', this.data[tune.name]);
      button.innerHTML = tune.icon;
      wrapper.appendChild(button);

      button.addEventListener('click', () => {
        this._toggleTune(tune.name);
        button.classList.toggle('cdx-settings-button--active');
      });

    });

    return wrapper;
  }


  _toggleTune(tune) {
    this.data[tune] = !this.data[tune];
    this._acceptTuneView();
  }


  _acceptTuneView() {
    this.settings.forEach(tune => {
      this.wrapper.classList.toggle(tune.name, !!this.data[tune.name]);
    });
  }
}

export default LinkData
