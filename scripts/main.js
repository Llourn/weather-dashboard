import "bulma/css/bulma.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "../styles/style.css";

import locationsData from "./models/locationsData";
import { init as locationsInit } from "./components/locations";
import { init as searchInit } from "./components/search";
import { init as modalInit } from "./components/modal";
import { init as weatherInit } from "./components/weather";
import { init as loadingInit } from "./components/loading";

document.querySelector("#app").innerHTML = /*html*/ `
  <!-- Hero section -->
  <header class="hero-section">
    <div class="hero-section-overlay"></div>
    <div class="hero-section-body">
      <p class="title">Weather Dashboard</p>
    </div>
  </header>
  <!-- Main content section -->
  <main class="columns is-desktop">
    <!-- Search and location history -->
    <div class="column is-one-third input-section">
      <!-- Search form and search results display -->
      <div class="tile is-parent">
        <div class="tile is-child box">
          <form id="search-form" class="field" action="">
            <div class="field">
              <label class="label">Search for location</label>
              <div class="control has-icons-left">
                <input
                  class="input is-primary"
                  type="text"
                  name="search-field"
                  placeholder="Enter location name here"
                />
                <span class="icon is-small is-left">
                  <i class="fas fa-search" aria-hidden="true"></i>
                </span>
              </div>
            </div>
            <div class="field is-grouped">
              <div class="control">
                <input type="submit" class="button is-primary" />
              </div>
              <div class="control">
                <button id="clear-search" class="button is-danger is-light">
                  Clear
                </button>
              </div>
            </div>
          </form>
          <div id="search-results"></div>
        </div>
      </div>
      <!-- Location history -->
      <div class="tile is-parent">
        <div id="location-container" class="tile is-child panel is-primary">
          <p class="panel-heading">Locations</p>
          <a class="panel-block is-active location-entry">
            Locations you searched for will show up here!
          </a>
        </div>
      </div>
    </div>
    <!-- Weather content section -->
    <div class="column">
      <!-- Loading animation -->
      <div id="loading" class="rain-cloud">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 277.7 332.1"
          style="enable-background: new 0 0 277.7 332.1"
          xml:space="preserve"
        >
          <style type="text/css">
            .st0 {
              fill: #51afe2;
            }
            .st1 {
              fill: #bcbdc4;
            }
            .st2 {
              fill: #9fa0a4;
            }
            .st3 {
              fill: #dadce0;
            }
          </style>
          <g id="raindrop_7">
            <path
              id="main_00000175289627920286223230000008634148534835143865_"
              class="st0"
              d="M221.4,187.1c0,4.8-3.3,8.7-7.4,8.7
c-4.1,0-7.4-3.9-7.4-8.7c0-4.8,7.4-18.3,7.4-18.3S221.4,182.3,221.4,187.1z"
            />
          </g>
          <g id="raindrop_6">
            <path
              id="main_00000054978295089950906740000000529729003617079743_"
              class="st0"
              d="M181.4,177.1c0,4.8-3.3,8.7-7.4,8.7
c-4.1,0-7.4-3.9-7.4-8.7c0-4.8,7.4-18.3,7.4-18.3S181.4,172.3,181.4,177.1z"
            />
          </g>
          <g id="raindrop_5">
            <path
              id="main_00000071524057214216038610000013106165907371237274_"
              class="st0"
              d="M119.4,184.6c0,4.2-2.9,7.5-6.5,7.5
c-3.6,0-6.5-3.4-6.5-7.5c0-4.2,6.5-15.8,6.5-15.8S119.4,180.5,119.4,184.6z"
            />
          </g>
          <g id="raindrop_4">
            <path
              id="main"
              class="st0"
              d="M71.4,197.1c0,4.8-3.3,8.7-7.4,8.7s-7.4-3.9-7.4-8.7c0-4.8,7.4-18.3,7.4-18.3S71.4,192.3,71.4,197.1
z"
            />
          </g>
          <g id="raindrop_3">
            <path
              id="main_00000001665681021031287050000005857343725565021349_"
              class="st0"
              d="M198,232.9c0,3.7-2.6,6.7-5.8,6.7
s-5.8-3-5.8-6.7c0-3.7,5.8-14.1,5.8-14.1S198,229.2,198,232.9z"
            />
          </g>
          <g id="raindrop_2">
            <path
              id="main_00000144297512132273377050000012391504958938325397_"
              class="st0"
              d="M151.4,227.1c0,4.8-3.3,8.7-7.4,8.7
c-4.1,0-7.4-3.9-7.4-8.7c0-4.8,7.4-18.3,7.4-18.3S151.4,222.3,151.4,227.1z"
            />
          </g>
          <g id="raindrop_1">
            <path
              id="main_00000161626802903723332030000000505290833059520663_"
              class="st0"
              d="M87.5,232.3c0,3.5-2.5,6.4-5.5,6.4
c-3,0-5.5-2.9-5.5-6.4c0-3.5,5.5-13.5,5.5-13.5S87.5,228.7,87.5,232.3z"
            />
          </g>
          <g id="cloud">
            <path
              id="main_00000105387485445990189160000016239694997232237957_"
              class="st1"
              d="M219.9,56.4c-0.3-25.9-20.3-47.6-46.6-49.7
c-18.1-1.4-34.6,6.9-44.6,20.5c-6.6-6.7-15.6-11.1-25.7-11.9c-22.3-1.7-41.8,15-43.5,37.3c-0.3,3.5-0.1,7,0.5,10.3
C40.6,69.3,26,86.9,24.3,108.6c-2.2,28.9,19.4,54.1,48.3,56.4c6.3,0.5,12.5-0.2,18.3-1.8c9.8,8.8,22.4,14.6,36.5,15.7
c19.6,1.5,37.7-6.4,50.1-19.8c6.2,3,13,5,20.3,5.5c30.7,2.4,57.5-20.6,59.8-51.3C259.6,87.5,243.5,64.3,219.9,56.4z"
            />
            <path
              id="shadow_00000083772107984599760230000004551087177560900270_"
              class="st2"
              d="M205.3,148.7c-7.3-0.6-14.1-2.5-20.3-5.5
c-12.3,13.4-30.5,21.3-50.1,19.8c-14.1-1.1-26.8-6.9-36.5-15.7c-5.8,1.6-11.9,2.3-18.3,1.8c-28.9-2.2-50.5-27.5-48.3-56.4
c0.2-3,0.7-5.9,1.4-8.7c-4.7,7.2-7.7,15.6-8.4,24.7c-2.2,28.9,19.4,54.1,48.3,56.4c6.3,0.5,12.5-0.2,18.3-1.8
c9.8,8.8,22.4,14.6,36.5,15.7c19.6,1.5,37.7-6.4,50.1-19.8c6.2,3,13,5,20.3,5.5c27.3,2.1,50.5-15.7,57.2-41.3
C244.8,140,226.5,150.3,205.3,148.7z"
            />
            <path
              id="highlight_00000018946845907203614500000008243809480800995479_"
              class="st3"
              d="M219.9,56.4
c-0.3-25.9-20.3-47.6-46.6-49.7c-18.1-1.4-34.6,6.9-44.6,20.5c-6.6-6.7-15.6-11.1-25.7-11.9C86,14,70.7,23.3,63.6,37.7
c8.1-8.5,19.8-13.4,32.4-12.4c10.1,0.8,19.1,5.2,25.7,11.9c10-13.6,26.5-21.9,44.6-20.5c26,2,45.9,23.4,46.6,49
c-6.1-2.5-12.9-3.9-19.9-3.9c-16.2,0-30.7,7.4-40.3,18.9c-9.3-6.4-20.5-10.2-32.6-10.2c-8.6,0-16.8,1.9-24.1,5.3
c-8.7-6.3-8.7-8.2-19.5-11.7c-4-1.3-12.7-2.7-17.4-0.6c1.5-0.1,8.6,0.4,12.8,2c14.3,5.4,16.7,9.1,26.3,20.9
c6.5-2.5,13.5-3.9,20.8-3.9c13.4,0,25.8,4.6,35.5,12.3c8.5-17.5,26.5-29.5,47.2-29.5c4.1,0,8.2,0.5,12,1.4
c23.1,8.2,38.9,31.1,36.9,56.8c-0.6,8.2-3,15.8-6.7,22.5c7.7-8.7,12.7-20,13.7-32.5C259.6,87.5,243.5,64.3,219.9,56.4z"
            />
          </g>
        </svg>
      </div>
      <div class="tile is-vertical">
        <!-- Today's weather -->
        <div id="current-conditions" class="tile is-parent is-vertical content">
          <div class="tile is-child box">
            <h2>Instructions</h2>
            <p>
              Enter a location in the search bar and choose the correct location
              from the search results. Once the location is selected the weather
              for that location will load here.
            </p>
            <p>
              If you'd like to remove any item from the location list, just
              click on the <span class="delete"></span> next to the location
              name.
            </p>
            <p>Enjoy! ????</p>
          </div>
        </div>
        <!-- Five day forecast -->
        <div id="five-day-forecast" class="tile content"></div>
      </div>
    </div>
  </main>
  <footer class="footer">
    <div class="content has-text-centered">
      <p>
        <strong>Weather Dashboard</strong> by
        <a href="https://lornecyr.com">Lorne Cyr</a>. The source code is
        licensed
        <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
      </p>
      <p>
        Header photo by
        <a
          href="https://unsplash.com/@mosiknife?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
          >mosi knife</a
        >
        on
        <a
          href="https://unsplash.com/photos/-PVgDgKXgZA?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
          >Unsplash</a
        >
      </p>
    </div>
  </footer>

  <div id="modal" class="modal">
    <div id="modal-background" class="modal-background"></div>
    <div class="modal-content notification is-warning">
      <div class="modal-icon">
        <i class="fa-solid fa-triangle-exclamation fa-2xl"></i>
      </div>
      <div id="modal-text" class="modal-text">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores fuga
        nobis illo quasi distinctio voluptatibus accusamus ex aliquam nihil ut,
        voluptatem praesentium cumque. Laboriosam, at consectetur iste
        distinctio voluptate repudiandae!
      </div>
    </div>
    <button class="modal-close is-large" aria-label="close"></button>
  </div>
`;

locationsData.init();
searchInit();
locationsInit();
modalInit();
weatherInit();
loadingInit();
