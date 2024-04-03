window.transitionToPage = function(href) {
    document.querySelector('body').style.opacity = 0;
    setTimeout(function() { 
        window.location.href = href;   
    }, 250)
    setTimeout(function() { 
        document.querySelector('body').style.opacity = 1;        
    }, 600)
}

document.addEventListener('DOMContentLoaded', function(event) {
    document.querySelector('body').style.opacity = 1;
});

/**
 * sends a request to the specified url from a form. this will change the window location.
 * @param {string} path the path to send the post request to
 * @param {object} params the parameters to add to the url
 * @param {string} [method=post] the method to use on the form
 */
function post(path, params, method='post') {

    // The rest of this code assumes you are not using a library.
    // It can be made less verbose if you use one.
    const form = document.createElement('form');
    form.method = method;
    form.action = path;
  
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = key;
        hiddenField.value = params[key];
  
        form.appendChild(hiddenField);
      }
    }
  
    document.body.appendChild(form);
    form.submit();
  }

console.log(` ______     __  __     __   __    
/\\  == \\   /\\ \\/\\ \\   /\\ "-.\\ \\   
\\ \\  __<   \\ \\ \\_\\ \\  \\ \\ \\-.  \\  
 \\ \\_\\ \\_\\  \\ \\_____\\  \\ \\_\\\\"\\_\\ 
  \\/_/ /_/   \\/_____/   \\/_/ \\/_/ 
                                  `)