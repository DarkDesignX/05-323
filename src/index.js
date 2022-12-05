import hh from "hyperscript-helpers";
import { h, diff, patch } from "virtual-dom";
import createElement from "virtual-dom/create-element";

const { div, p, input, button, table, tr, td, br } = hh(h);

const btnStyle = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";
const inputStyle = "border-2 border-black";
const rowStyle = "min-w-[450px] border border-slate-300";
const delBtnStyle = "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded";
const MSGS = {
  createRow: "createRow",
};

function view(dispatch, model) {
  return div ({ }, [ 
    div({ className: " text-center gap-4 items-center" }, [
    p({className: "text-2xl" }, `Meal:`),
    input({type:"text", className: inputStyle, id:"nameInput"}),
    br({}),
    br({}),
    p({className: "text-2xl" }, `Calories:`),
    input({type:"number", className: inputStyle, id:"caloriesInput"}),
    br({}),
    br({}),
    button({ className: btnStyle, onclick: () => dispatch(MSGS.createRow) }, "Create" + model.currentMeal + model.currentCalories),
    ]), 
    table({ className: "text-center mx-auto border-collapse mt-10", id:"table" }, [
      tr({ className: "" }, [
        td({ className: rowStyle }, "Meal"),
        td({ className: rowStyle }, "Calories"),
      ]),
    ]),
    br({}),
    p({className: "text-2xl text-center" }, `Calories Total: ${caloriesTotal}`)
  ]);
}

function update(msg, model) {
  switch (msg) {
    case MSGS.createRow:
      const table = document.getElementById("table");
      const row = table.insertRow(-1);
      const meal = row.insertCell(-1);
      const calories = row.insertCell(-1);
      const deleteRow = row.insertCell(-1);
      const delButton = document.createElement("button");
      deleteRow.appendChild(delButton);

      meal.className = rowStyle;
      calories.className = rowStyle;
      delButton.className = delBtnStyle;

      delButton.addEventListener("click", function(event) {
        const td = event.target.parentNode; 
        const tr = td.parentNode;
        tr.parentNode.removeChild(tr);
      });

      meal.innerText = document.getElementById("nameInput").value;
      calories.innerText = document.getElementById("caloriesInput").value;
      delButton.innerText = "Delete";
      return model;
    default:
      return model;
  }
}

const initModel = {
  currentMeal: "",
  currentCalories: ""
};

const caloriesTotal = 0;

function app(initModel, update, view, node) {
  let model = initModel;
  let currentView = view(dispatch, model);
  let rootNode = createElement(currentView);
  node.appendChild(rootNode);
  function dispatch(msg) {
    model = update(msg, model);
    const updatedView = view(dispatch, model);
    const patches = diff(currentView, updatedView);
    rootNode = patch(rootNode, patches);
    currentView = updatedView;
  }
}

const rootNode = document.getElementById("app");

app(initModel, update, view, rootNode);