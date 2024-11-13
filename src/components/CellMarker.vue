<template>
  <div class="marker-container"></div>
</template>

<style scoped>
.marker-container {
  width: 100%;
  height: 100%;
  padding: 0.25em;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  position: absolute;
  opacity: 1;
  transition: opacity 250ms ease-out;
  z-index: 5;
}

.marker {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.675em;
  font-weight: 400;
  color: #989ea2;
  cursor: pointer;
  opacity: 0.5;
  font-weight: 600;
  visibility: hidden;
  border-radius: 50%;
  transform: translate3d(0, 0, 0);
  transition:
    color 250ms ease-in-out,
    opacity 250ms ease-in-out,
    background-color 250ms ease-in-out,
    transform 250ms ease-out;
}

.marker:not(.selected):nth-child(1) {
  transform: translate3d(100%, 100%, 0);
}
.marker:not(.selected):nth-child(2) {
  transform: translate3d(0, 100%, 0);
}
.marker:not(.selected):nth-child(3) {
  transform: translate3d(-100%, 100%, 0);
}
.marker:not(.selected):nth-child(4) {
  transform: translate3d(100%, 0, 0);
}
.marker:not(.selected):nth-child(5) {
  transform: translate3d(0, 0, 0);
}
.marker:not(.selected):nth-child(6) {
  transform: translate3d(-100%, 0, 0);
}
.marker:not(.selected):nth-child(7) {
  transform: translate3d(100%, -100%, 0);
}
.marker:not(.selected):nth-child(8) {
  transform: translate3d(0, -100%, 0);
}
.marker:not(.selected):nth-child(9) {
  transform: translate3d(-100%, -100%, 0);
}

.marker.selected {
  opacity: 1;
  visibility: visible;
}

.marker-container:hover .marker {
  opacity: 0.5;
  transform: translate3d(0, 0, 0);
  visibility: visible;
}

.marker-container:hover .marker.selected {
  opacity: 1;
  background-color: rgba(90, 120, 151, 0.5);
}

.marker-container:hover .marker:hover {
  opacity: 1;
}
</style>
