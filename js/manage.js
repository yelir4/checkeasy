/**
 * Use this function to get a JSON object of a list based on ID
 * @param id The id of the list to fetch
 * @returns {Promise<void>} JSON object
 */
const getListData = async (id) => {
    await fetch("..php/getLists.php")
        .then(res => res.json())
        .then(data => {
            return data[id];
        });
}