<div class="form-group" id="form-group-<%=property.id%>">
    <label for="<%=property.id%>"><%=property.label%></label>
    <input type="text" class="form-control" id="<%=property.id%>" placeholder="<%=property.defaultValue%>" value="<%=property.value%>" spellcheck="false">
    <div class="description"><%=property.helpText%></div>
</div>