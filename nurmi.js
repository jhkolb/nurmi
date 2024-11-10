const METERS_PER_MILE = 1609.344
const MILES_PER_MARATHON = 26.2

const SECONDS_PER_HOUR = 3600
const SECONDS_PER_MINUTE = 60

function leadingZero(input) {
    if (input.value.length === 0) {
        input.value = "00";
    } else if (input.value.length === 1) {
        input.value = "0" + input.value;
    }
}

function convertDistanceToMeters(original_value, original_unit) {
    switch (original_unit) {
        case "m":
            return original_value;
        case "km":
            return original_value * 1000;
        case "mi":
            return original_value * METERS_PER_MILE;
        case "half_marathons":
            return original_value * 0.5 * MILES_PER_MARATHON * METERS_PER_MILE;
        case "marathons":
            return original_value * MILES_PER_MARATHON * METERS_PER_MILE;
        default:
            // Should never happen
            console.log("Invalid total distance unit selected");
            return original_value;
    }
}

function generateSplitDistances(split_distance_meters, total_distance_meters) {
    let split_distances = [];
    let current_distance = split_distance_meters;
    while (current_distance < total_distance_meters) {
        split_distances.push(current_distance);
        current_distance += split_distance_meters;
    }
    return split_distances;
}

function generateSplitTimes(split_distances_meters, total_dist_meters, total_time_seconds) {
    return split_distances_meters.map((split_distance) =>
        (split_distance / total_dist_meters) * total_time_seconds);
}

function formatSplitDistances(split_distances_meters, desired_split_unit) {
    switch(desired_split_unit) {
        case "m":
            return split_distances_meters.map((dist) => `${dist} m`)
        case "km":
            return split_distances_meters.map((dist) => {
                let converted_dist = (dist / 1000.0).toFixed(2);
                return `${converted_dist} km`;
            });
        case "mi":
            return split_distances_meters.map((dist) => {
                let converted_dist = (dist / METERS_PER_MILE).toFixed(2);
                return `${converted_dist} mi`;
            });
        default:
            // Should never happen
            console.log("Invalid unit specified for split distance");
    }
}

function formatSplitTimes(split_times_seconds) {
    return split_times_seconds.map((time) => {
        let remaining_seconds = time;
        let total_hours = Math.floor(remaining_seconds / SECONDS_PER_HOUR);
        remaining_seconds %= SECONDS_PER_HOUR;
        let total_minutes = Math.floor(remaining_seconds / SECONDS_PER_MINUTE);
        remaining_seconds %= SECONDS_PER_MINUTE;
        let total_seconds = remaining_seconds;

        let formatted_minutes = total_minutes.toString().padStart(2, "0");
        let formatted_seconds = total_seconds.toFixed().toString().padStart(2, "0");
        return `${total_hours}:${formatted_minutes}:${formatted_seconds}`
    });
}

function populateSplitTable(table, split_distances, split_times) {
    let length = Math.min(split_distances.length, split_times.length);
    for (let i = 0; i < length; i++) {
        let new_row = table.insertRow(-1);

        let index_cell = new_row.insertCell(-1);
        index_cell.appendChild(document.createTextNode((i+1).toString()));

        let distance_cell = new_row.insertCell(-1);
        distance_cell.appendChild(document.createTextNode(split_distances[i]));

        let time_cell = new_row.insertCell(-1);
        time_cell.appendChild(document.createTextNode(split_times[i]));
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const num_inputs = document.querySelectorAll(".minSecInput");
    for (const num_input of num_inputs) {
        num_input.addEventListener("focusout", (e) => {
            leadingZero(e.target);
        });
    }

    document.querySelector("#bGenerate").addEventListener("click", (e) => {
        let existing_table_rows = document.querySelectorAll("tr");
        for (let i = 1; i < existing_table_rows.length; i++) {
            existing_table_rows[i].remove();
        }

        let total_distance_value = Number(document.querySelector("#iTotalDistanceValue").value);
        let total_distance_units = document.querySelector("#iTotalDistanceUnits").value;
        let total_distance_meters = convertDistanceToMeters(total_distance_value, total_distance_units);

        let split_distance_value = Number(document.querySelector("#iSplitDistanceValue").value);
        let split_distance_units = document.querySelector("#iSplitDistanceUnits").value;
        let split_distance_meters = convertDistanceToMeters(split_distance_value, split_distance_units);

        let pace_hours = Number(document.querySelector("#iPaceHours").value);
        let pace_minutes = Number(document.querySelector("#iPaceMins").value);
        let pace_seconds = Number(document.querySelector("#iPaceSecs").value);
        let pace_total_seconds = pace_hours * SECONDS_PER_HOUR + pace_minutes * SECONDS_PER_MINUTE + pace_seconds;

        let pace_distance_value = Number(document.querySelector("#iPaceDistanceValue").value);
        let pace_distance_units = document.querySelector("#iPaceDistanceUnits").value;
        let pace_distance_meters = convertDistanceToMeters(pace_distance_value, pace_distance_units);

        let total_time_seconds = pace_total_seconds * (total_distance_meters / pace_distance_meters);

        let split_distances_meters = generateSplitDistances(split_distance_meters, total_distance_meters);
        let split_times_seconds = generateSplitTimes(split_distances_meters, total_distance_meters, total_time_seconds);
        // Always include the full distance as well
        split_distances_meters.push(total_distance_meters);
        split_times_seconds.push(total_time_seconds);

        formatted_split_distances = formatSplitDistances(split_distances_meters, split_distance_units);
        formatted_split_times = formatSplitTimes(split_times_seconds);

        let split_table = document.querySelector("#tblSplits");
        populateSplitTable(split_table, formatted_split_distances, formatted_split_times);
        document.querySelector("#tblSplits").style.visibility = "visible";
    });
});
