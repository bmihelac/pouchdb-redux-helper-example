<html>
  <head>
    <title>Sample App</title>
    <style type="text/css">
body {
  background: #eee;
}
.example-enter {
  opacity: 0.01;
}

.example-enter.example-enter-active {
  opacity: 1;
  transition: opacity 500ms ease-in;
}

.example-leave {
  opacity: 1;
}

.example-leave.example-leave-active {
  opacity: 0.01;
  transition: opacity 300ms ease-in;
}

    </style>
  </head>
  <body>

    <h1><a href="http://bmihelac.github.io/pouchdb-redux-helper-example/">pouchdb-redux-helper example</a></h1>

    {% block body %}
      <div id='root'>
      </div>
    {% endblock %}

    {{ contents|safe }}

    <p>
      <a href="https://github.com/bmihelac/pouchdb-redux-helper-example">github.com/bmihelac/pouchdb-redux-helper-example</a>
    </p>

    {% block scripts %}
      {% if bundle %}
        <script src="{{ bundle }}"></script>
      {% endif %}
    {% endblock %}

    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-72195530-1', 'auto');
      ga('send', 'pageview');
    </script>

  </body>
</html>


