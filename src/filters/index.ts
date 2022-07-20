import Vue from "vue";

Vue.filter("formatScore", function (value: string) {
  return formatScore(value);
});

function formatScore(value: string): string {
  const newValue = value.charAt(0).toUpperCase() + value.slice(1);
  return newValue.replace(/([A-Z])/g, " $1").trim();
}
