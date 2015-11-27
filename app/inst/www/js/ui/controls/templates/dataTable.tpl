<table class="dataTable" id="<%=control.id%>" data-variablename="<%=control.controlProperties[0].value%>">

</table>


<%if(designTimeDescription.length ) {%>
	<pre><%=designTimeDescription%></pre>
<%}%>


<% if(isDesignTime) { %>
<script type="text/javascript">

	$('#<%=control.id%>').dataTable({
		"data":[{"SepalLength":"5.1","SepalWidth":"3.5","PetalLength":"1.4","PetalWidth":"0.2","Species":"setosa"},{"SepalLength":"4.9","SepalWidth":"3","PetalLength":"1.4","PetalWidth":"0.2","Species":"setosa"},{"SepalLength":"4.7","SepalWidth":"3.2","PetalLength":"1.3","PetalWidth":"0.2","Species":"setosa"},{"SepalLength":"4.6","SepalWidth":"3.1","PetalLength":"1.5","PetalWidth":"0.2","Species":"setosa"},{"SepalLength":"5","SepalWidth":"3.6","PetalLength":"1.4","PetalWidth":"0.2","Species":"setosa"},{"SepalLength":"5.4","SepalWidth":"3.9","PetalLength":"1.7","PetalWidth":"0.4","Species":"setosa"},{"SepalLength":"4.6","SepalWidth":"3.4","PetalLength":"1.4","PetalWidth":"0.3","Species":"setosa"},{"SepalLength":"5","SepalWidth":"3.4","PetalLength":"1.5","PetalWidth":"0.2","Species":"setosa"},{"SepalLength":"4.4","SepalWidth":"2.9","PetalLength":"1.4","PetalWidth":"0.2","Species":"setosa"},{"SepalLength":"4.9","SepalWidth":"3.1","PetalLength":"1.5","PetalWidth":"0.1","Species":"setosa"},{"SepalLength":"5.4","SepalWidth":"3.7","PetalLength":"1.5","PetalWidth":"0.2","Species":"setosa"},{"SepalLength":"4.8","SepalWidth":"3.4","PetalLength":"1.6","PetalWidth":"0.2","Species":"setosa"},{"SepalLength":"4.8","SepalWidth":"3","PetalLength":"1.4","PetalWidth":"0.1","Species":"setosa"},{"SepalLength":"4.3","SepalWidth":"3","PetalLength":"1.1","PetalWidth":"0.1","Species":"setosa"},{"SepalLength":"5.8","SepalWidth":"4","PetalLength":"1.2","PetalWidth":"0.2","Species":"setosa"},{"SepalLength":"5.7","SepalWidth":"4.4","PetalLength":"1.5","PetalWidth":"0.4","Species":"setosa"},{"SepalLength":"5.4","SepalWidth":"3.9","PetalLength":"1.3","PetalWidth":"0.4","Species":"setosa"},{"SepalLength":"5.1","SepalWidth":"3.5","PetalLength":"1.4","PetalWidth":"0.3","Species":"setosa"},{"SepalLength":"5.7","SepalWidth":"3.8","PetalLength":"1.7","PetalWidth":"0.3","Species":"setosa"},{"SepalLength":"5.1","SepalWidth":"3.8","PetalLength":"1.5","PetalWidth":"0.3","Species":"setosa"}],
		"columns":[{"data":"SepalLength","title":"Sepal.Length"},{"data":"SepalWidth","title":"Sepal.Width"},{"data":"PetalLength","title":"Petal.Length"},{"data":"PetalWidth","title":"Petal.Width"},{"data":"Species","title":"Species"}]
	});

</script>
<% } %>




<!--
<table class="dataTable" id="<%=control.id%>" data-variablename="<%=control.controlProperties[0].value%>">
	<thead>
		<tr>
			<th>Col1</th>
			<th>Col2</th>
			<th>Col3</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>Row1-1</td>
			<td>Row1-2</td>
			<td>Row1-3</td>
		</tr>
		<tr>
			<td>Row2-1</td>
			<td>Row2-2</td>
			<td>Row2-3</td>
		</tr>
		<tr>
			<td>Row3-1</td>
			<td>Row3-2</td>
			<td>Row3-3</td>
		</tr>				
	</tbody>
</table>
-->


