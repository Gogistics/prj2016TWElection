window.binary_client = window.binary_client || new BinaryClient('ws://45.79.106.150:8888');
window.binary_client.on('open', function(stream) {
console.log(stream);
  // for the sake of this example let's put the stream in the window
  window.my_binary_stream = window.binary_client.createStream();

  // receive data
  window.my_binary_stream.on('data', function(data){
    console.log(data);
  });
});