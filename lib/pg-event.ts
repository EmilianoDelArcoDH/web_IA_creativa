const ID = "id";

export class PGEvent {
  data = {
    type: "blockly-type",
    id: "",
  };

  getValues() {
    const params = new URLSearchParams(document.location.search);
    this.data[ID] = params.get(ID) || "";
  }

  postToPg(dataObject: Record<string, unknown>) {
    dataObject.type = this.data.type;
    dataObject.id = this.data.id;
    console.log("[PGEvent] postToPg", dataObject);
    (window.top || window).postMessage(dataObject, "*");
  }
}
