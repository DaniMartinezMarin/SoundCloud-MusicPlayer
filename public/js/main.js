const Input = $("input");
const Lista = $(".lista");
const Caratula = $("#caratula");
const Musica = $("#music");
let buttonCreated = false;
const ENTER = 13;

SC.initialize({
    client_id: "Y9szWsPjYXE7XJAS5YeeakrLQx45A0BM"
  });

  const SearchArtist = async artist => {

    try{
          let tracks = await SC.get("/tracks", { q: artist });
          //console.log(tracks);
          Lista.empty(); //Limpia la lista de imagenes antes de poner las nuevas
  
          tracks.forEach(element => {
              if(element.artwork_url !== null){
                  Lista.append(Template(element));
              } 
          })
  
      }catch(error){
          console.error(error);
      } 
    
  };
  
  const Template = (element) =>{
      return `<img id="${element.id}" class="songs" src="${element.artwork_url}" draggable="true" ondragstart="drag(event)"></img>`;
  }
  
Input.keyup(function(e) {
  
    if (e.keyCode === ENTER) {
        let text = e.target.value.trim();
  
        if (text === "") {
            return alert("Nada que buscar");
        }
        SearchArtist(text);
    }
  });
  
  const allowDrop = (e) =>{
      e.preventDefault();
  }
  
  const drag = (e) =>{
  
      e.dataTransfer.setData("text", e.target.id); //Transferir informacion de un div a otro
      e.dataTransfer.setData("image", e.target.src);
  }
  
  const drop = async (e) =>{
  
      let id= e.dataTransfer.getData("text"); //text y image puede ser lo que quieras, solo identificativo
      let src = e.dataTransfer.getData("image");
  
      Caratula.empty();
      Caratula.append(`<img id="${id}" src="${src}" class="img-caratula"></img>`);
  
      let player = await SC.stream('/tracks/'+ id);
      
      if(!buttonCreated){
          createButtons();
      }
  
      manageButtons(player);
       
  } 
  
  const manageButtons = (player) =>{
      $('#play').click(function(){
          player.play();
      });
  
      $('#pause').click(function(){
          player.pause();
      });
  
      $('#stop').click(function(){
          player.pause();
          player.seek(0);
      });
  
      $('#myRange').change(function(){
          var value = $( ".selector" ).val();
          player.setVolume(value*0.01);
      });
  }
  
  
  const createButtons = () => {
      Musica.append(`<button class="btn btn-primary" id="play">Play</button>`);
      Musica.append(`<button class="btn btn-primary" id="pause">Pause</button>`);
      Musica.append(`<button class="btn btn-primary" id="stop">Stop</button>`);
      Musica.append(`<input type="range" min="0" max="100" value="50" class="selector" id="myRange">`);
  
      buttonCreated = true;
  }
