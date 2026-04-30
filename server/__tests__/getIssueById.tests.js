pm.test("Response has issue key", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property("issue");
});
