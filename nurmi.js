function leadingZero(input) {
    if (!isNaN(input.value) && input.value.length === 1) {
        input.value = "0" + input.value;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const num_inputs = document.querySelectorAll(".minSecInput");
    for (const num_input of num_inputs) {
        num_input.addEventListener("focusout", (e) => {
            leadingZero(e.target);
        });
    }

    document.querySelector("#bGenerate").addEventListener("click", () => {
        document.querySelector("#tblSplits").style.visibility = "visible";
    });
});
