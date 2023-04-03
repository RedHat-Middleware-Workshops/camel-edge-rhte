let clientMqtt;

function initMqtt(){


    var brokerHost = window.location.hostname.replace("camel-edge", "broker-amq-mqtt")
    var brokerPort = window.location.port 
    const brokerUrl=window.location.href+"/test"
    
    var brokerOptions = null
    
    //For local testing: when loading the page directly on the browser
    if (brokerHost == ""){
        brokerHost = "localhost"
        brokerPort = "8080"
    }
    
    //For local testing
    if (brokerPort == "8080"){
        brokerPort = "1883"
        brokerOptions = {onSuccess:onConnect}
    }
    else{
        brokerPort = "443"
        // brokerOptions = {useSSL:true,onSuccess:onConnect, onFailure:onFailure, onMessageArrived: onMessageArrived, onConnectionLost: onConnectionLost}
        brokerOptions = {useSSL:true,onSuccess:onConnect, onFailure:onFailure}
    }
    
    let uid = Date.now().toString(36) + Math.random().toString(36).substr(2)

    // Create a client instance
    // clientMqtt = new Paho.MQTT.Client(brokerHost, Number(brokerPort), "MonitorClient");
    clientMqtt = new Paho.MQTT.Client(brokerHost, Number(brokerPort), "MonitorClient-"+uid);
    // clientMqtt = new Paho.MQTT.Client(brokerHost, Number(brokerPort));
    
    // set callback handlers
    clientMqtt.onConnectionLost = onConnectionLost;
    // clientMqtt.onMessageArrived = onMessageArrived;
    
    // connect the client
    clientMqtt.connect(brokerOptions);

    // Reconnect mechanism in case MQTT connection is lost
    const interval = setInterval(function() {
      if(!clientMqtt.isConnected()){
          console.log("MQTT: attempting reconnect.");
          //somehow this field is automatically created on first connect
          //we need to remove it, otherwise it won't reconnect.
          delete brokerOptions.mqttVersionExplicit
          clientMqtt.connect(brokerOptions);
      }
      // method to be executed;
    }, 1000);
}

// called when the MQTT client connects
function onConnect() {
    console.log("MQTT: connected to broker");
    clientMqtt.onMessageArrived = onMessageArrived;
    clientMqtt.subscribe("monitor", 1);
}

function onConnectionLost(responseObject){
    console.log("MQTT: connection lost");
}

function onFailure(responseObject){
    console.log("MQTT: failure");
}

function onMessageArrived(msg){
    console.log("MQTT message: "+msg.payloadString);

    let process = JSON.parse(msg.payloadString)

    // let process = {
    //     origin: "mqtt",
    //     valid: true,
    //     // valid: false,
    //     price: 500
    // }

    console.log("MQTT message: "+process.origin);

    
    if(process.origin == "mqtt"){

        // sendMessage('T')

        // consumeMqttEvent("1", process)
        consumeMqttEvent(num, process)
    }
    else{
        // consumeHttpEvent("1", process)
        consumeHttpEvent(num, process)
    }

    num++
}


        function initWebSocket() {

        	var ws;
            
            if ("WebSocket" in window) {
               console.log("WebSocket is supported by your Browser!");
               
               // Let us open a web socket
               //var ws = new WebSocket("ws://localhost:9998/echo");
               ws = new WebSocket(((window.location.protocol === 'https:') ? 'wss://' : 'ws://') + window.location.host + '/camel/eventOffset');
             //localhost:8080/myapp/mysocket
    			
               ws.onopen = function() {
                  //nothing to do
               };
    			
               ws.onclose = function() {
                  // websocket is closed.
                  console.log("Connection is closed..."); 
               };
            } else {
               // The browser doesn't support WebSocket
               alert("WebSocket NOT supported by your Browser!");
            }

            return ws;
         }


      function startConsumer()
      {
        let scene = document.getElementById("scene");
        
        let pipe = document.createElement('a-box')
        pipe.setAttribute('position', {x: 0, y: 0, z: 0})
        pipe.setAttribute('height', .7)
        pipe.setAttribute('width' , 6)
        pipe.setAttribute('depth' , .3)
        pipe.setAttribute('side', "double")
        pipe.setAttribute('color', "grey")
        pipe.setAttribute('opacity', ".5")
        
        scene.appendChild(pipe)
        
        var processor = document.createElement('a-text')
        processor.setAttribute('value', 'Camel - Edge')
        processor.setAttribute('scale', "2 2 2")
        processor.setAttribute('align', 'center')
        processor.setAttribute('color', 'grey')
        scene.appendChild(processor);
        processor.setAttribute('position', {y: -0.7})
        
      }
      
      function consumeEventArray(array)
      {        
        let delay = 0;
        
        for(var i = 0; i < array.length; i++) {
          doSetTimeout(array[i], delay+=500)
        }
      }
      
      //needs independent function to copy values into setTimeout
      function doSetTimeout(item, delay) {
        setTimeout(function(){ consumeEvent(item)}, delay);
      }
      

      function sendMessage(protocol)
      {
        let scene = document.getElementById("scene");

        let process = {
            // origin: "mqtt",
            origin: protocol,
            valid: true,
            // valid: false,
            price: 500
        }

      //   consumeEvent(item)
        // consumeMqttEvent(item, process)

        if(protocol == "mqtt")
          consumeMqttEvent(num, process)
        else if(protocol == "http")
          consumeHttpEvent(num, process)
        
        num++
      }


      function consumeEvent(item)
      {
        posY = 0;
        var msg;
      
        msg = document.createElement('a-box')
        msg.setAttribute('position', {x: -10, y: posY, z: 0})
        msg.setAttribute('height', .5)
        msg.setAttribute('width' , .5)
        msg.setAttribute('depth' , .2)
        msg.setAttribute('side', "double")
        msg.setAttribute('color', "red")
        // msg.setAttribute('opacity', ".9")
        
        var number = document.createElement('a-text')
        number.setAttribute('value', item)
        number.setAttribute('align', 'center')
        number.setAttribute('scale', "2 2 2")
        msg.appendChild(number);
        number.setAttribute('position', {z: 0.148})
     
        let target = {  x: -3+.6,
                        y: posY, 
                        z: 0}
        
        msg.setAttribute(
            'animation',
            {  property: 'position', 
               dur: '1000', 
               delay: 0, 
               to: target,
               easing: 'easeOutQuad'
            });
       
        // let from = {  x: -3+.6,
        //                 y: posY, 
        //                 z: 0}
        
        let from = target;
        
        target = {  x: 3-.6,
                        y: posY, 
                        z: 0}
  
          msg.setAttribute(
            'animation__2',
            {  property: 'position', 
               dur: '3000', 
               delay: 950, 
               from: from,
               to: target,
               // easing: 'easeOutQuad'
            });

        
        
          msg.setAttribute(
            'animation__color',
            {  property: 'color', 
               dur: '3000', 
               delay: 1150, 
               // from: 'red',
               from: '#FF0000',
               to: '#00FF00',
               // easing: 'easeOutQuad'
            });
        
          
          msg.setAttribute(
            'animation__4',
            {  property: 'position', 
               dur: '1000', 
               delay: 3950, 
               from: target,
               to: "15 "+posY+" 0",
               // easing: 'easeOutQuad'
            });
          
          
          //listens animation end
          msg.addEventListener('animationcomplete', function cleanAnimation(evt) {

        	  //console.log("name detail: "+ evt.detail.name)
        	  
        	  //if (evt.detail.name = "animation__4")

        	  let pos = this.getAttribute("position").x
        	  
            if (pos == 15)
        	  {
	              //delete listener
	              this.removeEventListener('animationcomplete', cleanAnimation);
	
	              //delete animation
	              this.removeAttribute('animation');
	              
	              this.parentElement.removeChild(this);
        	  }
          }); 
          
          
          
        scene.appendChild(msg);  
        
        
      }



      function consumeMqttEvent(item, process)
      {
        posY = 0;
        var msg;
      
        msg = document.createElement('a-box')
        // msg.setAttribute('position', {x: -8, y: posY, z: 0})
        msg.setAttribute('position', {x: -8, y: 2, z: 0})
        msg.setAttribute('height', .5)
        msg.setAttribute('width' , .5)
        msg.setAttribute('depth' , .2)
        msg.setAttribute('side', "double")
        msg.setAttribute('color', "grey")
        // msg.setAttribute('opacity', ".9")
  

        var number = document.createElement('a-text')
        number.setAttribute('value', item)
        // number.setAttribute('value', "1")
        number.setAttribute('align', 'center')
        number.setAttribute('scale', "2 2 2")
        msg.appendChild(number);
        number.setAttribute('position', {z: 0.148})

        let target = {  x: -4+.6,
                        // y: posY, 
                        y: 2, 
                        z: 0}
        
        msg.setAttribute(
            'animation',
            {  property: 'position', 
               dur: '1000', 
               delay: 0, 
               to: target,
               easing: 'easeOutQuad'
            });
       
        // let from = {  x: -3+.6,
        //                 y: posY, 
        //                 z: 0}
        
        let from = target;
        
        target = {  x: -4+.6,
                        y: 0, 
                        z: 0}
  
          msg.setAttribute(
            'animation__2',
            {  property: 'position', 
               dur: '1000', 
               delay: 950, 
               from: from,
               to: target,
               // easing: 'easeOutQuad'
            });


            from = target;
        
            // target = {  x: 4-.6,
            target = {  x: 0,
                            y: 0, 
                            z: 0}
      
              msg.setAttribute(
                'animation__3',
                {  property: 'position', 
                   dur: '2000', 
                   delay: 1950, 
                   from: from,
                   to: target,
                   // easing: 'easeOutQuad'
                });
        
        /*
          msg.setAttribute(
            'animation__color',
            {  property: 'color', 
               dur: '3000', 
               delay: 1150, 
               // from: 'red',
               from: '#FF0000',
               to: '#00FF00',
               // easing: 'easeOutQuad'
            });
        
          
          msg.setAttribute(
            'animation__4',
            {  property: 'position', 
               dur: '1000', 
               delay: 3950, 
               from: target,
               to: "15 "+posY+" 0",
               // easing: 'easeOutQuad'
            });
          */
          
          //listens animation end
          msg.addEventListener('animationcomplete', function cleanAnimation(evt) {

        	  //console.log("name detail: "+ evt.detail.name)
        	  
        	  //if (evt.detail.name = "animation__4")

        	  let pos = this.getAttribute("position").x
        	  
            // if (pos == 15)
            if (pos == 0)
        	  {
	              //delete listener
	              this.removeEventListener('animationcomplete', cleanAnimation);
	
	              //delete animation
	              this.removeAttribute('animation');
	              
                  consumeMqttEventPhase2(item, this, process)
	            //   this.parentElement.removeChild(this);
        	  }
          }); 
 
        scene.appendChild(msg);        
      }
      


      function consumeHttpEvent(item, process)
      {
        posY = 0;
        var msg;
      
        msg = document.createElement('a-box')
        // msg.setAttribute('position', {x: -8, y: posY, z: 0})
        msg.setAttribute('position', {x: -8, y: 0, z: 0})
        msg.setAttribute('height', .5)
        msg.setAttribute('width' , .5)
        msg.setAttribute('depth' , .2)
        msg.setAttribute('side', "double")
        msg.setAttribute('color', "grey")
        // msg.setAttribute('opacity', ".9")


        var number = document.createElement('a-text')
        number.setAttribute('value', item)
        // number.setAttribute('value', "1")
        number.setAttribute('align', 'center')
        number.setAttribute('scale', "2 2 2")
        msg.appendChild(number);
        number.setAttribute('position', {z: 0.148})

        let target = {  x: -4+.6,
                        // y: posY, 
                        y: 0, 
                        z: 0}
        
        msg.setAttribute(
            'animation',
            {  property: 'position', 
               dur: '1000', 
               delay: 0, 
               to: target,
               easing: 'easeOutQuad'
            });
       

            from = target;
        
            // target = {  x: 4-.6,
            target = {  x: 0,
                            y: 0, 
                            z: 0}
      
              msg.setAttribute(
                'animation__2',
                {  property: 'position', 
                   dur: '2000', 
                   delay: 950, 
                   from: from,
                   to: target,
                   // easing: 'easeOutQuad'
                });
        

          
          //listens animation end
          msg.addEventListener('animationcomplete', function cleanAnimation(evt) {

        	  //console.log("name detail: "+ evt.detail.name)
        	  
        	  //if (evt.detail.name = "animation__4")

        	  let pos = this.getAttribute("position").x
        	  
            // if (pos == 15)
            if (pos == 0)
        	  {
	              //delete listener
	              this.removeEventListener('animationcomplete', cleanAnimation);
	
	              //delete animation
	              this.removeAttribute('animation');
	              
                  consumeMqttEventPhase2(item, this, process)
	            //   this.parentElement.removeChild(this);
        	  }
          }); 
 
        scene.appendChild(msg);        
      }
      

      //Renders events going to the AI engine
      function consumeMqttEventPhase2(item, msgOriginal, process)
      {
        posY = 0;
        var msg;

        msg = document.createElement('a-box')
        // msg.setAttribute('position', {x: -8, y: posY, z: 0})
        msg.setAttribute('position', {x: 0, y: 0, z: 0})
        msg.setAttribute('height', .5)
        msg.setAttribute('width' , .5)
        msg.setAttribute('depth' , .2)
        msg.setAttribute('side', "double")
        msg.setAttribute('color', "grey")
        // msg.setAttribute('color', "red")
        // msg.setAttribute('opacity', ".9")


        var number = document.createElement('a-text')
        number.setAttribute('value', item)
        // number.setAttribute('value', "2")
        number.setAttribute('align', 'center')
        number.setAttribute('scale', "2 2 2")
        msg.appendChild(number);
        number.setAttribute('position', {z: 0.148})
     
        let target = {  x: 0,
                        // y: posY, 
                        y: 3, 
                        z: 0}
        
        msg.setAttribute(
            'animation',
            {  property: 'position', 
               dur: '1000', 
               delay: 0, 
               to: target,
               easing: 'easeOutQuad'
            });
       
          
          //listens animation end
          msg.addEventListener('animationcomplete', function cleanAnimation(evt) {


        	  let pos = this.getAttribute("position").x
        	  
            // if (pos == 15)
            if (pos == 0)
        	  {
	              //delete listener
	              this.removeEventListener('animationcomplete', cleanAnimation);
	
	              //delete animation
	              this.removeAttribute('animation');
	              
	              this.parentElement.removeChild(this);
                  aiResult(item, msgOriginal, process)
                //   consumeMqttEventPhase3(item, msgOriginal)

                  if(process.valid){
                        queryPrice(item, msgOriginal, process)
                  }
                  else{
                      consumeMqttEventPhase3(item, msgOriginal, process)
                  }
        	  }
          }); 
          
        scene.appendChild(msg);  
       
      }


      function aiResult(item, msgOriginal, process)
      {
        posY = 0;
        var msg;

        msg = document.createElement('a-image')
        // msg.setAttribute('position', {x: -8, y: posY, z: 0})
        // msg.setAttribute('position', {x: 1.5, y: 3, z: 0})
        msg.setAttribute('position', {x: 2, y: 3, z: 0})

        if(process.valid){
            msg.setAttribute('src', "#valid")
        }
        else{
            msg.setAttribute('src', "#invalid")
        }
        
        msg.setAttribute('scale', ".8 .8 .8")

        var number = document.createElement('a-text')
        // number.setAttribute('value', item)
        
        if(process.valid){
            number.setAttribute('value', "valid")
        }
        else{
            number.setAttribute('value', "invalid")
        }
        
        number.setAttribute('position', {x: .5, y: 0, z: 0})
        // number.setAttribute('align', 'center')
        number.setAttribute('scale', "4 4 4")
        msg.appendChild(number);
        // number.setAttribute('position', {z: 0.148})
     
        // let target = {  x: 1,
        //                 // y: posY, 
        //                 y: 6, 
        //                 z: 0}
        
        let target = {  
            x: 0,
            y: 0, 
            z: 0}

        msg.setAttribute(
            'animation',
            // {  property: 'position', 
            // {  property: 'scale', 
            {  property: 'opacity', 
               dur: '2000', 
               delay: 0, 
              //  to: target,
              from: 1,
              to: 0,
               easing: 'easeOutQuad'
            });
       
            //text label child
            msg.firstChild.setAttribute(
              'animation',
              {  property: 'opacity', 
                 dur: '2000', 
                 delay: 0, 
                from: 1,
                to: 0,
                 easing: 'easeOutQuad'
              });

          
          //listens animation end
          msg.addEventListener('animationcomplete', function cleanAnimation(evt) {

        	  let pos = this.getAttribute("scale").y
        	  
            // if (pos == 15)
            // if (pos == 6)
            if (pos == 0)
        	  {
	              //delete listener
	              this.removeEventListener('animationcomplete', cleanAnimation);
	
	              //delete animation
	              this.removeAttribute('animation');
	              
	              this.parentElement.removeChild(this);
                  consumeMqttEventPhase3(item, msgOriginal, process)

        	  }
          }); 
          
        scene.appendChild(msg);  
       
      }


      //Renders events going to the AI engine
      function queryPrice(item, msgOriginal, process)
      {
        posY = 0;
        var msg;

        msg = document.createElement('a-box')
        // msg.setAttribute('position', {x: -8, y: posY, z: 0})
        msg.setAttribute('position', {x: 0, y: 0, z: 0})
        msg.setAttribute('height', .5)
        msg.setAttribute('width' , .5)
        msg.setAttribute('depth' , .2)
        msg.setAttribute('side', "double")
        msg.setAttribute('color', "grey")
        // msg.setAttribute('opacity', ".9")

        
        var number = document.createElement('a-text')
        number.setAttribute('value', item)
        // number.setAttribute('value', "2")
        number.setAttribute('align', 'center')
        number.setAttribute('scale', "2 2 2")
        msg.appendChild(number);
        number.setAttribute('position', {z: 0.148})
    
        let target = {  x: 0,
                        // y: posY, 
                        y: -3, 
                        z: 0}
        
        msg.setAttribute(
            'animation',
            {  property: 'position', 
               dur: '1000', 
               delay: 0, 
               to: target,
               easing: 'easeOutQuad'
            });
       
          
          //listens animation end
          msg.addEventListener('animationcomplete', function cleanAnimation(evt) {


        	  let pos = this.getAttribute("position").y
        	  
            // if (pos == 15)
            if (pos == -3)
        	  {
	              //delete listener
	              this.removeEventListener('animationcomplete', cleanAnimation);
	
	              //delete animation
	              this.removeAttribute('animation');
	              
	              this.parentElement.removeChild(this);
                  consumeMqttEventPhase3(item, msgOriginal, process)
                  priceResult(item, msgOriginal, process)
                //   consumeMqttEventPhase3(item, msgOriginal)
        	  }
          }); 

        scene.appendChild(msg);  

      }


      function priceResult(item, msgOriginal, process)
      {
        posY = 0;
        var msg;

        // msg = document.createElement('a-image')
        msg = document.createElement('a-entity')
        // msg.setAttribute('position', {x: -8, y: posY, z: 0})
        msg.setAttribute('position', {x: .5, y: -3, z: 0})
        // msg.setAttribute('src', "#valid")
        // msg.setAttribute('scale', ".5 .5 .5")

        var number = document.createElement('a-text')
        // number.setAttribute('value', item)
        number.setAttribute('value', process.price)
        number.setAttribute('position', {x: 0.5, y: 0, z: 0})
        // number.setAttribute('align', 'center')
        number.setAttribute('color', "yellow")
        number.setAttribute('scale', "4 4 4")
        msg.appendChild(number);
        // number.setAttribute('position', {z: 0.148})
     
        let target = {  x: 0,
                        // y: posY, 
                        y: 0, 
                        z: 0}
        
        msg.setAttribute(
            'animation',
            // {  property: 'scale', 
            {  property: 'opacity', 
               dur: '5000', 
               delay: 0, 
              //  to: target,
              from: 1, to: 0,
               easing: 'easeOutQuad'
            });
       
            //text label child
            msg.firstChild.setAttribute(
              'animation',
              {  property: 'opacity', 
                 dur: '5000', 
                 delay: 0, 
                from: 1,
                to: 0,
                 easing: 'easeOutQuad'
              });
          
          //listens animation end
          msg.addEventListener('animationcomplete', function cleanAnimation(evt) {

        	//   let pos = this.getAttribute("position").z
        	  let pos = this.getAttribute("scale").z
        	  
            // if (pos == 15)
            if (pos == 0)
        	  {
	              //delete listener
	              this.removeEventListener('animationcomplete', cleanAnimation);
	
	              //delete animation
	              this.removeAttribute('animation');
	              
	              this.parentElement.removeChild(this);
                  consumeMqttEventPhase3(item, msgOriginal, process)
        	  }
          }); 
          
        scene.appendChild(msg);  
       
      }


      function consumeMqttEventPhase3(item, msg, process)
      {
        posY = 0;
        // var msg;
   
        // msg.firstChild.setAttribute('value', "3")
        
            let from = {  x: 0,
                            y: 0, 
                            z: 0}
            
            target = {  x: 4-.6,
                y: 0, 
                z: 0}


              msg.setAttribute(
                'animation',
                {  property: 'position', 
                   dur: '2000', 
                   delay: 0, 
                   from: from,
                   to: target,
                   // easing: 'easeOutQuad'
                });
        
            //default red (invalid)
            let color = '#FF0000'

            if(process.valid){
                color = '#00FF00'
            }

          msg.setAttribute(
            'animation__color',
            {  property: 'color', 
               dur: '2000', 
               delay: 0, 
               // from: 'red',
            //    from: '#FF0000',
               from: '#808080',
            //    to: '#00FF00',
               to: color,
               // easing: 'easeOutQuad'
            });
        
          
          posY = 2

          let to = {
            x: 8,
            y: -2, 
            z: 0
          }

          if(process.valid){
            to.y = 2
          }

          msg.setAttribute(
            'animation__2',
            {  property: 'position', 
               dur: '1000', 
               delay: 1950, 
               from: target,
            //    to: "8 "+posY+" 0",
               to: to,
            //    to: "15 "+posY+" 0",
               // easing: 'easeOutQuad'
            });
          
          
          //listens animation end
          msg.addEventListener('animationcomplete', function cleanAnimation(evt) {

        	  //console.log("name detail: "+ evt.detail.name)
        	  
        	  //if (evt.detail.name = "animation__4")

        	  let pos = this.getAttribute("position").x
        	  
            if (pos == 8)
            // if (pos == 15)
            // if (pos == 0)
        	  {
	              //delete listener
	              this.removeEventListener('animationcomplete', cleanAnimation);
	
	              //delete animation
	              this.removeAttribute('animation');
	              
                //   consumeMqttEventPhase2(item, this)
	              this.parentElement.removeChild(this);
        	  }
          }); 
 
        // scene.appendChild(msg);        
      }
     