<%if(typeof control.controlProperties[1].value != 'undefined' && control.controlProperties[1].value.length) {%>
    <a href="<%=control.controlProperties[1].value%>" target="<%=control.controlProperties[2].value%>">
        <div id="<%=control.id%>" class="rplot">Please wait while the widget is loaded...</div>
    </a>
<%} else {%>
    <div id="<%=control.id%>" class="rplot">Please wait while the widget is loaded...</div>
<% } %>