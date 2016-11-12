(function($){
    var orderDesc = true;
    function getNotesFromServer(callback){
        $.get("/api/notes", callback, "json");
    }

    function compare(a, b) {
        if (a > b) {
            return -1;
        }
        if (a < b) {
            return 1;
        }
        return 0;
    }

    $(function(){
        var handlebarsContainer = $("#handlebarsContainer");
        //var monthsDropDown = $("#number-select");
        var createHtmlFromData = Handlebars.compile($("#handlebars-template").html());

        function renderData(data){
            //data.aktienkurse.sort((a,b) =>  orderDesc ? compare(a.firma, b.firma) : compare(b.firma, a.firma));
            handlebarsContainer.html(createHtmlFromData(data));
        }

        function getDataAndRenderTable(){
            getNotesFromServer(renderData);
        }

        //monthsDropDown.on("change", getDataAndRenderTable);

        getDataAndRenderTable();
/*
        switchSort = function  () {
            orderDesc = !orderDesc;
            getDataAndRenderTable();
        };
        $(".title-header").on("click", switchSort);
        */

    })
})(jQuery);