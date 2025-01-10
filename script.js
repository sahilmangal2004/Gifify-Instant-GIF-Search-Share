let submitBtn = document.getElementById("submit-btn");

let generateGif = () => {
    // Display loader until GIFs are loaded
    let loader = document.querySelector(".loader");
    loader.style.display = "block";
    document.querySelector(".wrapper").style.display = "none";

    // Get search value
    let q = document.getElementById("search-box").value.trim() || "trending"; // Default to "trending" if empty
    let gifCount = 12;

    // Define the API URL
    const apiKey = "MhV6czJLQboS4hqMqCBCrxcd3w2ssFa4"; // Replace with your Giphy API key
    let finalURL = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${q}&limit=${gifCount}&offset=0&rating=g&lang=en`;

    // Clear previous results
    let wrapper = document.querySelector(".wrapper");
    wrapper.innerHTML = "";

    // Fetch GIFs
    fetch(finalURL)
        .then((resp) => resp.json())
        .then((info) => {
            // Get all GIFs
            let gifsData = info.data;
            let loadedCount = 0;

            // If no GIFs are returned, show a message
            if (gifsData.length === 0) {
                loader.style.display = "none";
                wrapper.innerHTML = "<p>No GIFs found. Try another search.</p>";
                wrapper.style.display = "block";
                return;  // Stop further processing
            }

            // Loop through each GIF and display it
            gifsData.forEach((gif) => {
                let container = document.createElement("div");
                container.classList.add("container");

                let img = document.createElement("img");

                // Log the gif URL for debugging
                console.log(gif.images.downsized_medium.url);

                img.setAttribute("src", gif.images.downsized_medium.url);
                container.append(img);

                // Create the copy button
                let copyBtn = document.createElement("button");
                copyBtn.innerText = "Copy Link";
                
                // Fix scoping issue: Ensure 'gif' is captured correctly in the closure
                copyBtn.onclick = () => {
                    let copyLink = `https://media4.giphy.com/media/${gif.id}/giphy.mp4`;
                    navigator.clipboard.writeText(copyLink).then(() => {
                        alert("GIF copied to clipboard");
                    })
                    .catch(() => {
                        alert("GIF copied to clipboard (fallback)");
                        let hiddenInput = document.createElement("input");
                        hiddenInput.setAttribute("type", "text");
                        document.body.appendChild(hiddenInput);
                        hiddenInput.value = copyLink;

                        hiddenInput.select();
                        document.execCommand("copy");
                        document.body.removeChild(hiddenInput);
                    });
                };

                container.append(copyBtn);
                wrapper.append(container);
            });

            // Hide loader and show the wrapper after the GIFs have been loaded
            loader.style.display = "none";
            wrapper.style.display = "grid";
        })
        .catch((error) => {
            console.error("Error fetching data from Giphy API:", error);
            loader.style.display = "none"; // Hide loader on error
        });
};

// Event listeners
submitBtn.addEventListener("click", generateGif);
