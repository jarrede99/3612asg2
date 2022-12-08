
/* url of song api --- https versions hopefully a little later this semester */	
const api = 'https://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php';


const playlist = [];
/* note: you may get a CORS error if you try fetching this locally (i.e., directly from a
   local file). To work correctly, this needs to be tested on a local web server.  
   Some possibilities: if using Visual Code, use Live Server extension; if Brackets,
   use built-in Live Preview.
*/
let songdata;
let currentView = "searchview";
let previousView = "playlist";
let activeSnode;
let searchedSongs = [];


function populateArtists(){
	let artists = JSON.parse(aList);
	let parent = document.querySelector("#artists");
	for (let artist of artists){
		let option = document.createElement("option");
		option.setAttribute("value", artist.name);
		option.textContent = artist.name;
		parent.appendChild(option);
		
	}
}


function populateGenres(){
	let genres = JSON.parse(gList);
	let parent = document.querySelector("#genres");
	for (let genre of genres){
		let option = document.createElement("option");
		option.setAttribute("value", genre.name);
		option.textContent = genre.name;
		parent.appendChild(option);
	}
}


function populateSongs(disp, pview){
	let tables = document.querySelectorAll(".tablebody");
	let parent = tables[pview];
	if(disp.length > 0){
		for (let i = 0; i < disp.length; i++){
			let row = document.createElement("tr");
			let data = document.createElement("td");
			data.setAttribute("class", "stitle");
			data.setAttribute("data-id", disp[i].song_id);
			data.textContent = disp[i].title;
			row.appendChild(data);

			data = document.createElement("td");

			data.textContent = disp[i].artist.name;
			row.appendChild(data);

			data = document.createElement("td");
			data.textContent = disp[i].year;
			row.appendChild(data);

			data = document.createElement("td");
			data.textContent = disp[i].genre.name;
			row.appendChild(data);

			data = document.createElement("td");
			data.textContent = disp[i].details.popularity;
			row.appendChild(data);

			data = document.createElement("td");
			let pbtn = document.createElement("button");
			pbtn.setAttribute("class", "pbtn");
			if(!pview){
				pbtn.textContent = "Add";
				pbtn.setAttribute("data-id", disp[i].song_id);
			}
			else{
				pbtn.setAttribute("data-pindex", i);
				pbtn.textContent = "Remove";
			}
			data.appendChild(pbtn);
			row.appendChild(data);

			parent.appendChild(row);
		}
	}
}

/*<option value="example artist"></option>*/


/*
on radio click setAttribute disabled to active input and removeAttribute 
disabled from e.target parent's input node (?)

easier way to do this?
*/

function toggleInput(){
	const searchnodes = document.querySelectorAll(".searchnode");

	for(let node of searchnodes){
		let radio = node.querySelector("input");
		radio.addEventListener("click", (e) => {
			activeSnode.querySelector(".inputbox").setAttribute("disabled", "")
			node.querySelector(".inputbox").removeAttribute("disabled");
			activeSnode = node;
		})
	}

}

function singleSong(id){
	let song = songdata.find(i=>i.song_id==id);
	let info = document.querySelector("#info");
	let minutes = Math.floor(song.details.duration/60);
	let seconds = song.details.duration - (minutes*60);
	if(seconds<10){
		seconds = `0${seconds}`
	}
	info.textContent = `Song: ${song.title}, by ${song.artist.name}. Genre: ${song.genre.name}. Song length: ${minutes}:${seconds}, release year: ${song.year}`;

	info = document.querySelector("#info");
	let list = document.createElement("ul");
	let text = document.createElement("li");
	text.textContent = `bpm: ${song.details.bpm}`;
	list.appendChild(text);
	info = document.querySelector("#info");
	text = document.createElement("li");
	text.textContent = `energy: ${song.analytics.energy}`;
	list.appendChild(text);
	info = document.querySelector("#info");
	text = document.createElement("li");
	text.textContent = `danceability: ${song.analytics.danceability}`;
	list.appendChild(text);
	info = document.querySelector("#info");
	text = document.createElement("li");
	text.textContent = `liveness: ${song.analytics.liveness}`;
	list.appendChild(text);
	info = document.querySelector("#info");
	text = document.createElement("li");
	text.textContent = `valence: ${song.analytics.valence}`;
	list.appendChild(text);
	info = document.querySelector("#info");
	text = document.createElement("li");
	text.textContent = `acousticness: ${song.analytics.acousticness}`;
	list.appendChild(text);
	info = document.querySelector("#info");
	text = document.createElement("li");
	text.textContent = `speechiness: ${song.analytics.speechiness}`;
	list.appendChild(text);
	info = document.querySelector("#info");
	text = document.createElement("li");
	text.textContent = `popularity: ${song.details.popularity}`;
	list.appendChild(text);
	info.appendChild(list);

	const ctx = document.querySelector('#chart');

	new Chart(ctx, {
		type: 'radar',
		data: {
			labels: ['energy', 'danceability', 'liveness', 'valence', 'acousticness', 'speechiness'],
			datasets: [{
				backgroundColor: 'rgba(255, 99, 132, 0.2)',
				data: [song.analytics.energy, song.analytics.danceability, song.analytics.liveness, song.analytics.valence, song.analytics.acousticness, song.analytics.speechiness],
				borderWidth: 1
			}]
	  	},
		options: {}
	});
  
}

function createButtons(){
	let pbtn = document.querySelectorAll(".pbtn"); //click "add" button or "remove" button on a song
	for (button of pbtn){
		button.addEventListener("click", (e)=>{
			let id;
			if(currentView == "searchview"){
				id = e.target.getAttribute("data-id");
				song = songdata.find((i)=>i.song_id==id);
				playlist.push(song);
				let popup = document.querySelector("#toast-noti");
				popup.setAttribute("class","show");
				setTimeout(()=>{ popup.removeAttribute("class"); }, 3000);
			}
			else{
				id = e.target.getAttribute("data-pindex");
				song = playlist.splice(id, 1);
				populateSongs(playlist, 1);
				updateHeader();
				createButtons();
			}
		});
	}

	//songbutton i.e. click a song title
	let sbtn = document.querySelectorAll(".stitle");
	for (button of sbtn){
		button.addEventListener("click", (e)=>{
			let btn = document.querySelector("#hbutton");
			btn.textContent = "Back";
			let id = e.target.getAttribute("data-id");
			toggleView("songview");
			previousView = currentView;
			currentView = "songview";
			singleSong(id);
		});
	}
}

function sortchange(){
	let sortbtn = document.querySelectorAll("#search-results th");
	for (button of sortbtn){
		button.addEventListener("click", (e)=>{
			if(e.target.textContent=="Title v"){
				e.target.textContent="Title ^";
				searchedSongs.sort((a, b)=>{
					const nameA = a.title.toUpperCase(); // ignore upper and lowercase
					const nameB = b.title.toUpperCase(); // ignore upper and lowercase
					if (nameA < nameB) {
						return -1;
					}
					if (nameA > nameB) {
						return 1;
					}
		
					// names must be equal
					return 0;
				});
				searchedSongs.reverse();
			}
			else if(e.target.textContent=="Title ^"){
				e.target.textContent="Title v";
				searchedSongs.sort((a, b)=>{
					const nameA = a.title.toUpperCase(); // ignore upper and lowercase
					const nameB = b.title.toUpperCase(); // ignore upper and lowercase
					if (nameA < nameB) {
						return -1;
					}
					if (nameA > nameB) {
						return 1;
					}
		
					// names must be equal
					return 0;
				});
			}
			else if(e.target.textContent=="Artist v"){
				e.target.textContent="Artist ^";
				searchedSongs.sort((a, b)=>{
					const nameA = a.artist.name.toUpperCase(); // ignore upper and lowercase
					const nameB = b.artist.name.toUpperCase(); // ignore upper and lowercase
					if (nameA < nameB) {
						return -1;
					}
					if (nameA > nameB) {
						return 1;
					}
		
					// names must be equal
					return 0;
				});
				searchedSongs.reverse();
			}
			else if(e.target.textContent=="Artist ^"){
				e.target.textContent="Artist v";
				searchedSongs.sort((a, b)=>{
					const nameA = a.artist.name.toUpperCase(); // ignore upper and lowercase
					const nameB = b.artist.name.toUpperCase(); // ignore upper and lowercase
					if (nameA < nameB) {
						return -1;
					}
					if (nameA > nameB) {
						return 1;
					}
		
					// names must be equal
					return 0;
				});
			}
			else if(e.target.textContent=="Year v"){
				e.target.textContent="Year ^";
				searchedSongs.sort((a, b)=>a.year - b.year);
				searchedSongs.reverse();
			}
			else if(e.target.textContent=="Year ^"){
				e.target.textContent="Year v";
				searchedSongs.sort((a, b)=>a.year - b.year);
			}
			else if(e.target.textContent=="Genre v"){
				e.target.textContent="Genre ^";
				searchedSongs.sort((a, b)=>{
					const nameA = a.genre.name.toUpperCase(); // ignore upper and lowercase
					const nameB = b.genre.name.toUpperCase(); // ignore upper and lowercase
					if (nameA < nameB) {
						return -1;
					}
					if (nameA > nameB) {
						return 1;
					}
		
					// names must be equal
					return 0;
				});
				searchedSongs.reverse();
			}
			else if(e.target.textContent=="Genre ^"){
				e.target.textContent="Genre v";
				searchedSongs.sort((a, b)=>{
					const nameA = a.genre.name.toUpperCase(); // ignore upper and lowercase
					const nameB = b.genre.name.toUpperCase(); // ignore upper and lowercase
					if (nameA < nameB) {
						return -1;
					}
					if (nameA > nameB) {
						return 1;
					}
		
					// names must be equal
					return 0;
				});
				searchedSongs.reverse();
			}
			else if(e.target.textContent=="Popularity v"){
				e.target.textContent="Popularity ^";
				searchedSongs.sort((a, b)=>a.details.popularity - b.details.popularity);
				searchedSongs.reverse();
			}
			else if(e.target.textContent=="Popularity ^"){
				e.target.textContent="Popularity v";
				searchedSongs.sort((a, b)=>a.details.popularity - b.details.popularity);
			}

			populateSongs(searchedSongs, 0);
			createButtons();
		});
	}


}

/* add "hidden" class to all "main" elements and 
remove it from the element we wish to display. 
this will be added as a handler for any event that
changes the display (clicking the playlist button, 
clicking a song, and subsequently from each of the 
above, clicking the close view button.) i dont think 
"main" elements will have other classes but if they do
we'll cross thaty bridge when i make that choice*/
function toggleView(id){
	const searchnodes = document.querySelectorAll("main");
	const tables = document.querySelectorAll(".tablebody");

	for(let table of tables){
		table.innerHTML="";
	}
	for(let node of searchnodes){
	node.setAttribute("class", "hidden");
	}
	const visible = document.querySelector(`#${id}`);
	visible.removeAttribute("class");
}

function updateHeader(){
	let head =  document.querySelector("#playlist-box h3");
	if(playlist.length){
		let avgpop = 0
		playlist.map((i)=>avgpop+=i.details.popularity);
		avgpop = (avgpop/playlist.length).toPrecision(3);
		head.textContent = `${playlist.length} songs added! the average popularity of the songs on your playlist is ${avgpop}`;
	}
	else{
		head.textContent = "0 songs so far. Add some!";
	}
	head = document.querySelector("#playlist-box button");
	head.addEventListener("click", ()=>{
		playlist.splice(0, playlist.length);
		updateHeader();
		populateSongs(playlist, 1);
	});
}

function postfetch(){
	populateArtists();
	populateGenres();

	//switching views with the button beside "credits" in the header
	let btn = document.querySelector("#hbutton");
	btn.addEventListener("click", (e)=>{
		toggleView(previousView); 

		if(previousView == "playlist"){
			e.target.textContent = "Back";
			previousView = "searchview";
			currentView = "playlist";
			populateSongs(playlist, 1);
			createButtons();
			updateHeader();
		}
		else{
			e.target.textContent = "Playlist";
			currentView = previousView;
			previousView = "playlist";
		}
	
	});

	//submitting a search term
	const form = document.querySelector("#searchbox");

	form.addEventListener("reset", (e)=>{
		let parent = document.querySelector(".tablebody");
		parent.innerHTML="";
	});

	form.addEventListener("submit", (e)=>{
		e.preventDefault();
		const formData = new FormData(form);

		let titlenode = document.querySelector(".searchnode");
		form.reset();
		if(activeSnode != titlenode){
			activeSnode.querySelector(".inputbox").setAttribute("disabled", "")
			titlenode.querySelector(".inputbox").removeAttribute("disabled");
		}
		if(formData.get("title")){
			console.log(formData);
			searchedSongs = songdata.filter((i)=>i.title.toString().toUpperCase().includes(formData.get("title").toUpperCase()));
			console.log(searchedSongs);
		}
		else if(formData.get("artists")){
			searchedSongs = songdata.filter((i)=>i.artist.name == formData.get("artists"));
		}
		else if(formData.get("genres")){
			searchedSongs = songdata.filter((i)=>i.genre.name == formData.get("genres"));
		}
		else{
		 	searchedSongs = songdata;
		}
		searchedSongs.sort((a, b)=>{
			const nameA = a.title.toUpperCase(); // ignore upper and lowercase
			const nameB = b.title.toUpperCase(); // ignore upper and lowercase
			if (nameA < nameB) {
				return -1;
			}
			if (nameA > nameB) {
				return 1;
			}

			// names must be equal
			return 0;
			});
		populateSongs(searchedSongs, 0);
		createButtons();
	});
}


document.addEventListener("DOMContentLoaded", function() {
	activeSnode = document.querySelector(".searchnode");


	//check if its in local storage, if not fetch
	const data = localStorage.getItem('jevansongdata');
	if(!data){
		fetch(api)
		.then(response => response.json())
		.then(dat =>{
			console.log(dat);
			songdata = dat;
			const store = JSON.stringify(songdata);
			localStorage.setItem('jevansongdata', store);
			postfetch();
		});
	}
	else{
		songdata = JSON.parse(data);
		console.log(songdata);
		postfetch();
	}
	toggleInput();
	sortchange();

	let credit = document.querySelector("#credits");
	credit.addEventListener('mouseover', () => {
		let popup = document.querySelector("#credits-popup");
		popup.setAttribute("class","show");
		setTimeout(()=>{ popup.removeAttribute("class"); }, 5000);
	});

})

