<!-- Código jQuery referência na web -->
<script type="text/javascript" charset="utf8" src="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.8.2.min.js"></script>

<!-- Montando o JQuery do DataTables -->
<script type="text/javascript" charset="utf8" src="http://ajax.aspnetcdn.com/ajax/jquery.dataTables/1.9.4/jquery.dataTables.min.js"></script>


<!-- Referência ao css DataTables CSS -->
<!-- DataTables CSS -->
<!-- <link rel="stylesheet" type="text/css" href="http://ajax.aspnetcdn.com/ajax/jquery.dataTables/1.9.4/css/jquery.dataTables.css"> -->
<!-- <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.11/css/jquery.dataTables.min.css"> -->
<link rel="stylesheet" type="text/css" href="/DraddX/chamados/SiteAssets/PainelChamados/css/jquery.dataTables.css">
<!-- Estilos -->
<style type="text/css">
#WelcomeMessage {
    margin-bottom: 20px;
}
#filtrosConsulta{
	width:25%;
	float:left;
	background-color:#e6e6e6 !important;
	border:1px solid #aaaaaa;
	padding:10px;
	overflow:auto;
	margin-bottom: 70px;
}
#filtrosConsulta select{
	width:212px;
	max-width:212px;

	
}
#WelcomeMessageUserName {
    font-weight: bold;
}


</style>

<h2>Painel de Chamados</h2>
<br>
<div id="WelcomeMessage">
    Bem Vindo <span id="WelcomeMessageUserName"></span>
	<br>
	<br>
	<p>
		<a href="/DraddX/chamados/Lists/chamado/NewForm.aspx" target="_blank" ><img src="/DraddX/chamados/SiteAssets/PainelChamados/imagens/Abri-chamados.jpg" alt="Abrir Chamado"></a>
		<a href="/DraddX/chamados/Lists/chamado" target="_blank" ><img src="/DraddX/chamados/SiteAssets/PainelChamados/imagens/chamados.jpg" alt="Chamados"></a>
	</p>
</div>

<div id="filtrosConsulta">
<h2>Consulta de Chamados</h2>
<p></p>
<p><span class='label'>Status:<span style='color:red'>*</span></span>
			<select id="status">
			<option value="Todos">Todos</option>
			<option value="Aberto">Aberto</option>
			<option value="Em Andamento">Em Andamento</option>
			<option value="Disponibilizado em Homologação">Disponibilizado em Homologação</option>
			<option value="Disponibilizado em Produção">Disponibilizado em Produção</option>
			<option value="Finalizado">Finalizado</option>
			</select>
</p>
<input type="button" class='botaoCarregarChamado' value="Carregar Chamados" onclick="LoadChamado($('#status').val());">
<p></p>
</div>

<!-- Criando a tabela para exibição dos dados -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" class="display" id="tbChamado">
<thead><th>Editar</th><th>Chamado</th><th>Status</th><th>Criado por</th></thead>
</table>

<script type="text/javascript">
$(document).ready( function(){
		getUserProfileInfo();		
});

// user info data
function getUserProfileInfo() {
    var siteUrl = _spPageContextInfo.webAbsoluteUrl;
    var fullUrl = siteUrl + "/_api/social.feed/my";

    $.ajax({
        url: fullUrl,
        type: "GET",
        headers: {
            "accept": "application/json;odata=verbose",
            "content-type": "application/json;odata=verbose",
        },
        success: onUserInfoQuerySucceeded,
        error: onUserInfoQueryFailed
    });
}

function onUserInfoQuerySucceeded(data) {
	$("#WelcomeMessageUserName").text(data.d.Me.Name);
}

function onUserInfoQueryFailed(sender, args) {
    alert("Error");
}

function LoadChamado(status){
	if (status == "Todos")
		urlCall = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/GetByTitle('chamado')/items?"+"$select=Id,Title,Status,Author/Title&$expand=Author/Id";
	else
		urlCall = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/GetByTitle('chamado')/items?"+"$select=Id,Title,Status,Author/Title&$expand=Author/Id&$filter=(Status eq '"+status+"')";

		var call = $.ajax({
			
			url: urlCall,
            type: "GET",
            dataType: "json",
            headers: {
                Accept: "application/json;odata=verbose"
            }
       
        });
        call.done(function (data,textStatus, jqXHR){
            $('#tbChamado').dataTable({
                "bDestroy": true,
                "bProcessing": true,
                "aaData": data.d.results,
                "aoColumns": [
					{ "mData": function (data, type, row, meta) {
						return '<a href="/DraddX/chamados/Lists/chamado/EditForm.aspx?ID='+data.Id+ '" target="_blank"><img src="/DraddX/chamados/SiteAssets/PainelChamados/imagens/edititem.gif"></a>';
                                }
                    },
					{ "mData": function (data, type, row, meta) {
						return '<a href="/DraddX/chamados/Lists/chamado/DispForm.aspx?ID='+data.Id+ '" target="_blank">'+data.Title+'</a>';
                                }
                    },
					{ "mData": "Status" },
					{ "mData": "Author.Title" }
                ]
              });
        });
        call.fail(function (jqXHR,textStatus,errorThrown){
            alert("Error retrieving Tasks: " + jqXHR.responseText);
        });
}

</script>