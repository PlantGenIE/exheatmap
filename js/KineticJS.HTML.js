(function() {
    Kinetic.HTML = function(config) {
        this.___init(config);
    };

    Kinetic.HTML.prototype = {
        ___init: function(config) {
            var d = document.createElement("div");
            var content = "<div style='display:inline-block'>" + config.html || "" + "</div>"
            d.innerHTML = content;
            d.style.display="inline-block";
            document.body.insertBefore(d, document.body.childNodes[0]);
            var size = d.getBoundingClientRect();
            d.parentNode.removeChild(d);
            var template = this.__template.replace(/{width}/g,size.width+"px").replace(/{height}/g,size.height+"px").replace("{html}",config.html || "");
            var DOMURL = self.URL || self.webkitURL || self;
            var img = new Image();
            var svg = new Blob([template], {type: "image/svg+xml;charset=utf-8"});
            var url = DOMURL.createObjectURL(svg);
            var _this = this;
            Kinetic.Image.prototype.___init.call(this, config);
            img.onload = function() {
                _this.setImage(img);
                config.callback();
             };
            img.src = url;
            this.className = 'HTMLImage';
        },
        __template : "<svg xmlns='http://www.w3.org/2000/svg' width='{width}' height='{height}'>" +
             "<foreignObject width='{width}' height='{height}'>" +
               "<div xmlns='http://www.w3.org/1999/xhtml' style='font-size:10px'>" +
                 "{html}" + 
               "</div>" +
             "</foreignObject>" +
           "</svg>"
    }
    Kinetic.Util.extend(Kinetic.HTML, Kinetic.Image);
})();
