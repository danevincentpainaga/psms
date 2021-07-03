module.exports =
/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 183:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {


var _ = __nccwpck_require__(804);
var util = __nccwpck_require__(328);

/**
 *
 * @param {Object} config
 * @param {Number} config.x X offset in EMU's
 * @param {Number} config.y Y offset in EMU's
 * @param {Number} config.width Width in EMU's
 * @param {Number} config.height Height in EMU's
 * @constructor
 */
var AbsoluteAnchor = function (config) {
    this.x = null;
    this.y = null;
    this.width = null;
    this.height = null;
    if(config) {
        this.setPos(config.x, config.y);
        this.setDimensions(config.width, config.height);
    }
};
_.extend(AbsoluteAnchor.prototype, {
    /**
     * Sets the X and Y offsets.
     *
     * @param {Number} x
     * @param {Number} y
     * @returns {undefined}
     */
    setPos: function (x, y) {
        this.x = x;
        this.y = y;
    },
    /**
     * Sets the width and height of the image.
     *
     * @param {Number} width
     * @param {Number} height
     * @returns {undefined}
     */
    setDimensions: function (width, height) {
        this.width = width;
        this.height = height;
    },
    toXML: function (xmlDoc, content) {
        var root = util.createElement(xmlDoc, 'xdr:absoluteAnchor');
        var pos = util.createElement(xmlDoc, 'xdr:pos');
        pos.setAttribute('x', this.x);
        pos.setAttribute('y', this.y);
        root.appendChild(pos);

        var dimensions = util.createElement(xmlDoc, 'xdr:ext');
        dimensions.setAttribute('cx', this.width);
        dimensions.setAttribute('cy', this.height);
        root.appendChild(dimensions);

        root.appendChild(content);

        root.appendChild(util.createElement(xmlDoc, 'xdr:clientData'));
        return root;
    }
});
module.exports = AbsoluteAnchor;

/***/ }),

/***/ 75:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {


var _ = __nccwpck_require__(804);
//var util = require('../util');
var Chart = function () {

};
_.extend(Chart.prototype, {

});
module.exports = Chart;

/***/ }),

/***/ 982:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {


var _ = __nccwpck_require__(804);
var util = __nccwpck_require__(328);

/**
 *
 * @param {Object} config
 * @param {Number} config.x The cell column number that the top left of the picture will start in
 * @param {Number} config.y The cell row number that the top left of the picture will start in
 * @param {Number} config.width Width in EMU's
 * @param {Number} config.height Height in EMU's
 * @constructor
 */
var OneCellAnchor = function (config) {
    this.x = null;
    this.y = null;
    this.xOff = null;
    this.yOff = null;
    this.width = null;
    this.height = null;
    if(config) {
        this.setPos(config.x, config.y, config.xOff, config.yOff);
        this.setDimensions(config.width, config.height);
    }
};
_.extend(OneCellAnchor.prototype, {
    setPos: function (x, y, xOff, yOff) {
        this.x = x;
        this.y = y;
        if(xOff !== undefined) {
            this.xOff = xOff;
        }
        if(yOff !== undefined) {
            this.yOff = yOff;
        }
    },
    setDimensions: function (width, height) {
        this.width = width;
        this.height = height;
    },
    toXML: function (xmlDoc, content) {
        var root = util.createElement(xmlDoc, 'xdr:oneCellAnchor');
        var from = util.createElement(xmlDoc, 'xdr:from');
        var fromCol = util.createElement(xmlDoc, 'xdr:col');
        fromCol.appendChild(xmlDoc.createTextNode(this.x));
        var fromColOff = util.createElement(xmlDoc, 'xdr:colOff');
        fromColOff.appendChild(xmlDoc.createTextNode(this.xOff || 0));
        var fromRow = util.createElement(xmlDoc, 'xdr:row');
        fromRow.appendChild(xmlDoc.createTextNode(this.y));
        var fromRowOff = util.createElement(xmlDoc, 'xdr:rowOff');
        fromRowOff.appendChild(xmlDoc.createTextNode(this.yOff || 0));
        from.appendChild(fromCol);
        from.appendChild(fromColOff);
        from.appendChild(fromRow);
        from.appendChild(fromRowOff);

        root.appendChild(from);

        var dimensions = util.createElement(xmlDoc, 'xdr:ext');
        dimensions.setAttribute('cx', this.width);
        dimensions.setAttribute('cy', this.height);
        root.appendChild(dimensions);

        root.appendChild(content);

        root.appendChild(util.createElement(xmlDoc, 'xdr:clientData'));
        return root;
    }
});
module.exports = OneCellAnchor;

/***/ }),

/***/ 147:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {


var _ = __nccwpck_require__(804);
var util = __nccwpck_require__(328);
var Drawing = __nccwpck_require__(890);

var Picture = function () {
    this.media = null;
    this.id = _.uniqueId('Picture');
    this.pictureId = util.uniqueId('Picture');
    this.fill = {};
    this.mediaData = null;
};

Picture.prototype = new Drawing();

_.extend(Picture.prototype, {
    setMedia: function (mediaRef) {
        this.mediaData = mediaRef;
    },
    setDescription: function (description) {
        this.description = description;
    },
    setFillType: function (type) {
        this.fill.type = type;
    },
    setFillConfig: function (config) {
        _.extend(this.fill, config);
    },
    getMediaType: function () {
        return 'image';
    },
    getMediaData: function () {
        return this.mediaData;
    },
    setRelationshipId: function (rId) {
        this.mediaData.rId = rId;
    },
    toXML: function (xmlDoc) {
        var pictureNode = util.createElement(xmlDoc, 'xdr:pic');

        var nonVisibleProperties = util.createElement(xmlDoc, 'xdr:nvPicPr');

        var nameProperties = util.createElement(xmlDoc, 'xdr:cNvPr', [
            ['id', this.pictureId],
            ['name', this.mediaData.fileName],
            ['descr', this.description || ""]
        ]);
        nonVisibleProperties.appendChild(nameProperties);
        var nvPicProperties = util.createElement(xmlDoc, 'xdr:cNvPicPr');
        nvPicProperties.appendChild(util.createElement(xmlDoc, 'a:picLocks', [
            ['noChangeAspect', '1'],
            ['noChangeArrowheads', '1']
        ]));
        nonVisibleProperties.appendChild(nvPicProperties);
        pictureNode.appendChild(nonVisibleProperties);
        var pictureFill = util.createElement(xmlDoc, 'xdr:blipFill');
        pictureFill.appendChild(util.createElement(xmlDoc, 'a:blip', [
            ['xmlns:r', util.schemas.relationships],
            ['r:embed', this.mediaData.rId]
        ]));
        pictureFill.appendChild(util.createElement(xmlDoc, 'a:srcRect'));
        var stretch = util.createElement(xmlDoc, 'a:stretch');
        stretch.appendChild(util.createElement(xmlDoc, 'a:fillRect'));
        pictureFill.appendChild(stretch);
        pictureNode.appendChild(pictureFill);

        var shapeProperties = util.createElement(xmlDoc, 'xdr:spPr', [
            ['bwMode', 'auto']
        ]);

        var transform2d = util.createElement(xmlDoc, 'a:xfrm');
        shapeProperties.appendChild(transform2d);

        var presetGeometry = util.createElement(xmlDoc, 'a:prstGeom', [
            ['prst', 'rect']
        ]);
        shapeProperties.appendChild(presetGeometry);



        pictureNode.appendChild(shapeProperties);
//            <xdr:spPr bwMode="auto">
//                <a:xfrm>
//                    <a:off x="1" y="1"/>
//                    <a:ext cx="1640253" cy="1885949"/>
//                </a:xfrm>
//                <a:prstGeom prst="rect">
//                    <a:avLst/>
//                </a:prstGeom>
//                <a:noFill/>
//                <a:extLst>
//                    <a:ext uri="{909E8E84-426E-40DD-AFC4-6F175D3DCCD1}">
//                        <a14:hiddenFill xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main">
//                            <a:solidFill>
//                                <a:srgbClr val="FFFFFF"/>
//                            </a:solidFill>
//                        </a14:hiddenFill>
//                    </a:ext>
//                </a:extLst>
//            </xdr:spPr>
//
        return this.anchor.toXML(xmlDoc, pictureNode);
    }
});

module.exports = Picture;


/***/ }),

/***/ 527:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {


var _ = __nccwpck_require__(804);
var util = __nccwpck_require__(328);

var TwoCellAnchor = function (config) {
    this.from = {xOff: 0, yOff: 0};
    this.to = {xOff: 0, yOff: 0};
    if(config) {
        this.setFrom(config.from.x, config.from.y, config.to.xOff, config.to.yOff);
        this.setTo(config.to.x, config.to.y, config.to.xOff, config.to.yOff);
    }
};
_.extend(TwoCellAnchor.prototype, {
    setFrom: function (x, y, xOff, yOff) {
        this.from.x = x;
        this.from.y = y;
        if(xOff !== undefined) {
            this.from.xOff = xOff;
        }
        if(yOff !== undefined) {
            this.from.yOff = xOff;
        }
    },
    setTo: function (x, y, xOff, yOff) {
        this.to.x = x;
        this.to.y = y;
        if(xOff !== undefined) {
            this.to.xOff = xOff;
        }
        if(yOff !== undefined) {
            this.to.yOff = xOff;
        }
    },
    toXML: function (xmlDoc, content) {
        var root = util.createElement(xmlDoc, 'xdr:twoCellAnchor');

        var from = util.createElement(xmlDoc, 'xdr:from');
        var fromCol = util.createElement(xmlDoc, 'xdr:col');
        fromCol.appendChild(xmlDoc.createTextNode(this.from.x));
        var fromColOff = util.createElement(xmlDoc, 'xdr:colOff');
        fromColOff.appendChild(xmlDoc.createTextNode(this.from.xOff));
        var fromRow = util.createElement(xmlDoc, 'xdr:row');
        fromRow.appendChild(xmlDoc.createTextNode(this.from.y));
        var fromRowOff = util.createElement(xmlDoc, 'xdr:rowOff');
        fromRowOff.appendChild(xmlDoc.createTextNode(this.from.yOff));

        from.appendChild(fromCol);
        from.appendChild(fromColOff);
        from.appendChild(fromRow);
        from.appendChild(fromRowOff);

        var to = util.createElement(xmlDoc, 'xdr:to');
        var toCol = util.createElement(xmlDoc, 'xdr:col');
        toCol.appendChild(xmlDoc.createTextNode(this.to.x));
        var toColOff = util.createElement(xmlDoc, 'xdr:colOff');
        toColOff.appendChild(xmlDoc.createTextNode(this.from.xOff));
        var toRow = util.createElement(xmlDoc, 'xdr:row');
        toRow.appendChild(xmlDoc.createTextNode(this.to.y));
        var toRowOff = util.createElement(xmlDoc, 'xdr:rowOff');
        toRowOff.appendChild(xmlDoc.createTextNode(this.from.yOff));

        to.appendChild(toCol);
        to.appendChild(toColOff);
        to.appendChild(toRow);
        to.appendChild(toRowOff);


        root.appendChild(from);
        root.appendChild(to);

        root.appendChild(content);

        root.appendChild(util.createElement(xmlDoc, 'xdr:clientData'));
        return root;
    }
});
module.exports = TwoCellAnchor;


/***/ }),

/***/ 890:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {


var _ = __nccwpck_require__(804);
var AbsoluteAnchor = __nccwpck_require__(183);
var OneCellAnchor = __nccwpck_require__(982);
var TwoCellAnchor = __nccwpck_require__(527);

/**
 * This is mostly a global spot where all of the relationship managers can get and set
 * path information from/to. 
 * @module Excel/Drawing
 */
var Drawing = function () {
    this.id = _.uniqueId('Drawing');
};

_.extend(Drawing.prototype, {
    /**
     *
     * @param {String} type Can be 'absoluteAnchor', 'oneCellAnchor', or 'twoCellAnchor'.
     * @param {Object} config Shorthand - pass the created anchor coords that can normally be used to construct it.
     * @returns {Anchor}
     */
    createAnchor: function (type, config) {
        config = config || {};
        config.drawing = this;
        switch(type) {
            case 'absoluteAnchor':
                this.anchor = new AbsoluteAnchor(config);
                break;
            case 'oneCellAnchor':
                this.anchor = new OneCellAnchor(config);
                break;
            case 'twoCellAnchor':
                this.anchor = new TwoCellAnchor(config);
                break;
        }
        return this.anchor;
    }
});

Object.defineProperties(Drawing, {
    AbsoluteAnchor: {get: function () { return __nccwpck_require__(183); }},
    Chart: {get: function () { return __nccwpck_require__(75); }},
    OneCellAnchor: {get: function () { return __nccwpck_require__(982); }},
    Picture: {get: function () { return __nccwpck_require__(147); }},
    TwoCellAnchor: {get: function () { return __nccwpck_require__(527); }}
});

module.exports = Drawing;


/***/ }),

/***/ 861:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

/**
 * @module Excel/Drawings
 */

var _ = __nccwpck_require__(804);
var util = __nccwpck_require__(328);
var RelationshipManager = __nccwpck_require__(785);

var Drawings = function () {
    this.drawings = [];
    this.relations = new RelationshipManager();
    this.id = _.uniqueId('Drawings');
};

_.extend(Drawings.prototype, {
    /**
     * Adds a drawing (more likely a subclass of a Drawing) to the 'Drawings' for a particular worksheet.
     *
     * @param {Drawing} drawing
     * @returns {undefined}
     */
    addDrawing: function (drawing) {
        this.drawings.push(drawing);
    },
    getCount: function () {
        return this.drawings.length;
    },
    toXML: function () {
        var doc = util.createXmlDoc(util.schemas.spreadsheetDrawing, 'xdr:wsDr');
        var drawings = doc.documentElement;
        drawings.setAttribute('xmlns:a', util.schemas.drawing);
        drawings.setAttribute('xmlns:r', util.schemas.relationships);
        drawings.setAttribute('xmlns:xdr', util.schemas.spreadsheetDrawing);

        for(var i = 0, l = this.drawings.length; i < l; i++) {

            var rId = this.relations.getRelationshipId(this.drawings[i].getMediaData());
            if(!rId) {
                rId = this.relations.addRelation(this.drawings[i].getMediaData(), this.drawings[i].getMediaType()); //chart
            }
            this.drawings[i].setRelationshipId(rId);
            drawings.appendChild(this.drawings[i].toXML(doc));
        }
        return doc;
    }
});

module.exports = Drawings;

/***/ }),

/***/ 753:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {



/**
 * @module Excel/Pane
 *
 * https://msdn.microsoft.com/en-us/library/documentformat.openxml.spreadsheet.pane%28v=office.14%29.aspx
 */
var _ = __nccwpck_require__(804);

var Pane = function () {

    /*
    Possible Values:
     null
     split	Split
     frozen	Frozen
     frozenSplit	Frozen Split
     http://www.datypic.com/sc/ooxml/t-ssml_ST_PaneState.html
     */
    this.state = null;
    this.xSplit = null;
    this.ySplit = null;
    this.activePane = 'bottomRight';
    this.topLeftCell = null;

};

_.extend(Pane.prototype, {

    freezePane: function(column, row, cell) {
        this._freezePane = {xSplit: column, ySplit: row, cell: cell};
    },

    exportXML: function (doc) {
        var pane = doc.createElement('pane');

        if(this.state !== null) {
            pane.setAttribute('xSplit', this._freezePane.xSplit);
            pane.setAttribute('ySplit', this._freezePane.ySplit);
            pane.setAttribute('topLeftCell', this._freezePane.cell);
            pane.setAttribute('activePane', 'bottomRight');
            pane.setAttribute('state', 'frozen');
        }
        return pane;
    }
});

module.exports = Pane;

/***/ }),

/***/ 255:
/***/ (function(module) {


/**
 * This is mostly a global spot where all of the relationship managers can get and set
 * path information from/to.
 * @module Excel/Paths
 */
module.exports = {};


/***/ }),

/***/ 864:
/***/ (function(module) {



module.exports = {
    /**
     * Converts pixel sizes to 'EMU's, which is what Open XML uses.
     *
     * @todo clean this up. Code borrowed from http://polymathprogrammer.com/2009/10/22/english-metric-units-and-open-xml/,
     * but not sure that it's going to be as accurate as it needs to be.
     *
     * @param int pixels
     * @returns int
     */
    pixelsToEMUs: function (pixels) {
        return Math.round(pixels * 914400 / 96);
    }
};


/***/ }),

/***/ 785:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {


var _ = __nccwpck_require__(804);
var util = __nccwpck_require__(328);
var Paths = __nccwpck_require__(255);


/**
 * @module Excel/RelationshipManager
 */
var RelationshipManager = function () {
    this.relations = {};
    this.lastId = 1;
};

_.uniqueId('rId'); //priming

_.extend(RelationshipManager.prototype, {

    importData: function (data) {
        this.relations = data.relations;
        this.lastId = data.lastId;
    },
    exportData: function () {
        return {
            relations: this.relations,
            lastId: this.lastId
        };
    },

    addRelation: function (object, type) {
        this.relations[object.id] = {
            id: _.uniqueId('rId'),
            schema: util.schemas[type],
            object: object
        };
        return this.relations[object.id].id;
    },

    getRelationshipId: function (object) {
        return this.relations[object.id] ? this.relations[object.id].id : null;
    },

    toXML: function () {
        var doc = util.createXmlDoc(util.schemas.relationshipPackage, 'Relationships');
        var relationships = doc.documentElement;

        _.each(this.relations, function (data, id) {
            var relationship = util.createElement(doc, 'Relationship', [
                ['Id', data.id],
                ['Type', data.schema],
                ['Target', data.object.target || Paths[id]]
            ]);
            if (data.object.targetMode) {
              relationship.setAttribute('TargetMode', data.object.targetMode);
            }
            relationships.appendChild(relationship);
        });
        return doc;
    }
});

module.exports = RelationshipManager;


/***/ }),

/***/ 349:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {


var _ = __nccwpck_require__(804);
var util = __nccwpck_require__(328);


/**
 * @module Excel/SharedStrings
 */
var sharedStrings = function () {
    this.strings = {};
    this.stringArray = [];
    this.id = _.uniqueId('SharedStrings');
};
_.extend(sharedStrings.prototype, {
    /**
     * Adds a string to the shared string file, and returns the ID of the
     * string which can be used to reference it in worksheets.
     *
     * @param string {String}
     * @return int
     */
    addString: function (string) {
        this.strings[string] = this.stringArray.length;
        this.stringArray[this.stringArray.length] = string;
        return this.strings[string];
    },

    exportData: function () {
        return this.strings;
    },

    toXML: function () {
        var doc = util.createXmlDoc(util.schemas.spreadsheetml, 'sst');
        var sharedStringTable = doc.documentElement;
        this.stringArray.reverse();
        var l = this.stringArray.length;
        sharedStringTable.setAttribute('count', l);
        sharedStringTable.setAttribute('uniqueCount', l);

        var template = doc.createElement('si');
        var templateValue = doc.createElement('t');
        templateValue.appendChild(doc.createTextNode('--placeholder--'));
        template.appendChild(templateValue);
        var strings = this.stringArray;

        while (l--) {
            var clone = template.cloneNode(true);
            clone.firstChild.firstChild.nodeValue = strings[l];
            sharedStringTable.appendChild(clone);
        }

        return doc;
    }
});
module.exports = sharedStrings;

/***/ }),

/***/ 958:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

/**
 * @module Excel/SheetView
 *
 * https://msdn.microsoft.com/en-us/library/documentformat.openxml.spreadsheet.sheetview%28v=office.14%29.aspx
 *
 */

var _ = __nccwpck_require__(804);
var Pane = __nccwpck_require__(753);
var util = __nccwpck_require__(328);

var SheetView = function (config) {
    config = config || {};

    this.pane = config.pane || new Pane();
    this.showZeros = null; //Default
    this.defaultGridColor = null;
    this.colorId = null;
    this.rightToLeft = null;
    this.showFormulas = null;
    this.showGridLines = null;
    this.showOutlineSymbols = null;
    this.showRowColHeaders = null;
    this.showRuler = null;
    this.showWhiteSpace = null;
    this.tabSelected = null;
    this.topLeftCell = null;
    this.viewType = null; //http://www.datypic.com/sc/ooxml/t-ssml_ST_SheetViewType.html
    this.windowProtection = null;
    this.zoomScale = null;
    this.zoomScaleNormal = null;
    this.zoomScalePageLayoutView = null;
    this.zoomScaleSheetLayoutView = null;
};

_.extend(SheetView.prototype, {

    /**
     * Added froze pane
     * @param column - column number: 0, 1, 2 ...
     * @param row - row number: 0, 1, 2 ...
     * @param cell - 'A1'
     * @deprecated
     */
    freezePane: function(column, row, cell) {
        this.pane.state = 'frozen';
        this.pane.xSplit = column;
        this.pane.ySplit = row;
        this.pane.topLeftCell = cell;
    },

    exportXML: function (doc) {
        var sheetViews = doc.createElement('sheetViews'),
            sheetView = doc.createElement('sheetView');

        util.setAttributesOnDoc(sheetView, {
            //TODO apparent you can add 'book views'.. investigate what these are
            workbookViewId: 0,
            showZeros: {v: this.showZeros, type: Boolean},
            defaultGridColor:  {v: this.defaultGridColor, type: Boolean},
            //TODO: I have no idea what this even is :\
            colorId: this.colorId,
            rightToLeft:  {v: this.rightToLeft, type: Boolean},
            showFormulas:  {v: this.showFormulas, type: Boolean},
            showGridLines:  {v: this.showGridLines, type: Boolean},
            showOutlineSymbols:  {v: this.showOutlineSymbols, type: Boolean},
            showRowColHeaders:  {v: this.showRowColHeaders, type: Boolean},
            showRuler:  {v: this.showRuler, type: Boolean},
            showWhiteSpace:  {v: this.showWhiteSpace, type: Boolean},
            tabSelected:  {v: this.tabSelected, type: Boolean},
            viewType: this.viewType,
            windowProtection:  {v: this.windowProtection, type: Boolean},
            zoomScale:  {v: this.zoomScale, type: Boolean},
            zoomScaleNormal: this.zoomScaleNormal,
            zoomScalePageLayoutView: this.zoomScalePageLayoutView,
            zoomScaleSheetLayoutView: this.zoomScaleSheetLayoutView
        });

        sheetView.appendChild(this.pane.exportXML(doc));

        sheetViews.appendChild(sheetView);
        return sheetViews;
    }
});

module.exports = SheetView;


/***/ }),

/***/ 747:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

/**
 * @module Excel/StyleSheet
 */

var _ = __nccwpck_require__(804);
var util = __nccwpck_require__(328);

var StyleSheet = function () {
    this.id = _.uniqueId('StyleSheet');
    this.cellStyles = [{
        name:"Normal",
        xfId:"0",
        builtinId:"0"
    }];
    this.defaultTableStyle = false;
    this.differentialStyles = [{}];
    this.masterCellFormats = [{
        numFmtId: 0,
        fontId: 0,
        fillId: 0,
        borderId: 0,
        xfid: 0
    }];
    this.masterCellStyles = [{
        numFmtId: 0,
        fontId: 0,
        fillId: 0,
        borderId: 0
    }];
    this.fonts = [{}];
    this.numberFormatters = [];
    this.fills = [{}, {
        type: 'pattern',
        patternType: 'gray125',
        fgColor: 'FF333333',
        bgColor: 'FF333333'
    }];
    this.borders = [{
        top: {},
        left: {},
        right: {},
        bottom: {},
        diagonal: {}
    }];
    this.tableStyles = [];
};
_.extend(StyleSheet.prototype, {
    createSimpleFormatter: function (type) {
        var sid = this.masterCellFormats.length;
        var style = {
            id: sid
        };
        switch(type) {
            case 'date':
                style.numFmtId = 14;
                break;
        }
        this.masterCellFormats.push(style);
        return style;
    },

    createFill: function (fillInstructions) {
        var id = this.fills.length;
        var fill = fillInstructions;
        fill.id = id;
        this.fills.push(fill);
        return fill;
    },

    createNumberFormatter: function (formatInstructions) {
        var id = this.numberFormatters.length + 100;
        var format = {
            id: id,
            formatCode: formatInstructions
        };
        this.numberFormatters.push(format);
        return format;
    },

    /**
    * alignment: {
    *  horizontal: http://www.schemacentral.com/sc/ooxml/t-ssml_ST_HorizontalAlignment.html
    *  vertical: http://www.schemacentral.com/sc/ooxml/t-ssml_ST_VerticalAlignment.html
    *  @param {Object} styleInstructions
    */
    createFormat: function (styleInstructions) {
        var sid = this.masterCellFormats.length;
        var style = {
            id: sid
        };
        if (styleInstructions.protection) {
            style.protection = styleInstructions.protection;
        }
        if(styleInstructions.font && _.isObject(styleInstructions.font)) {
            style.fontId = this.createFontStyle(styleInstructions.font).id;
        } else if(styleInstructions.font) {
            if(_.isNaN(parseInt(styleInstructions.font, 10))) {
                throw "Passing a non-numeric font id is not supported";
            }
            style.fontId = styleInstructions.font;
        }

        if (styleInstructions.format && _.isString(styleInstructions.format)) {
            style.numFmtId = this.createNumberFormatter(styleInstructions.format).id;
        } else if(styleInstructions.format) {
            if(_.isNaN(parseInt(styleInstructions.format, 10))) {
                throw "Invalid number formatter id";
            }
            style.numFmtId = styleInstructions.format;
        }

        if (styleInstructions.border && _.isObject(styleInstructions.border)) {
            style.borderId = this.createBorderFormatter(styleInstructions.border).id;
        } else if (styleInstructions.border) {
            if(_.isNaN(parseInt(styleInstructions.border, 10))) {
                throw "Passing a non-numeric border id is not supported";
            }
            style.borderId = styleInstructions.border;
        }

        if (styleInstructions.fill && _.isObject(styleInstructions.fill)) {
            style.fillId = this.createFill(styleInstructions.fill).id;
        } else if (styleInstructions.fill) {
            if(_.isNaN(parseInt(styleInstructions.fill, 10))) {
                throw "Passing a non-numeric fill id is not supported";
            }
            style.fillId = styleInstructions.fill;
        }

        if (styleInstructions.alignment && _.isObject(styleInstructions.alignment)) {
            style.alignment = _.pick(
                styleInstructions.alignment,
                'horizontal',
                'justifyLastLine',
                'readingOrder',
                'relativeIndent',
                'shrinkToFit',
                'textRotation',
                'vertical',
                'wrapText'
                );
        }

        this.masterCellFormats.push(style);
        return style;
    },

    createDifferentialStyle: function (styleInstructions) {
        var id = this.differentialStyles.length;
        var style = {
            id: id
        };
        if(styleInstructions.font && _.isObject(styleInstructions.font)) {
            style.font = styleInstructions.font;
        }
        if (styleInstructions.border && _.isObject(styleInstructions.border)) {
            style.border = _.defaults(styleInstructions.border, {
                top: {},
                left: {},
                right: {},
                bottom: {},
                diagonal: {}
    });
        }
        if (styleInstructions.fill && _.isObject(styleInstructions.fill)) {
            style.fill = styleInstructions.fill;
        }
        if (styleInstructions.alignment && _.isObject(styleInstructions.alignment)) {
            style.alignment = styleInstructions.alignment;
        }
        if (styleInstructions.format && _.isString(styleInstructions.format)) {
            style.numFmt = styleInstructions.format;
        }
        this.differentialStyles[id] = style;
        return style;
    },

    /**
     * Should be an object containing keys that match with one of the keys from this list:
     * http://www.schemacentral.com/sc/ooxml/t-ssml_ST_TableStyleType.html
     *
     * The value should be a reference to a differential format (dxf)
     * @param {Object} instructions
     */
    createTableStyle: function (instructions) {
        this.tableStyles.push(instructions);
    },

    /**
    * All params optional
    * Expects: {
    * top: {},
    * left: {},
    * right: {},
    * bottom: {},
    * diagonal: {},
    * outline: boolean,
    * diagonalUp: boolean,
    * diagonalDown: boolean
    * }
    * Each border should follow:
    * {
    * style: styleString, http://www.schemacentral.com/sc/ooxml/t-ssml_ST_BorderStyle.html
    * color: ARBG color (requires the A, so for example FF006666)
    * }
    * @param {Object} border
    */
    createBorderFormatter: function (border) {
        _.defaults(border, {
            top: {},
            left: {},
            right: {},
            bottom: {},
            diagonal: {},
            id: this.borders.length
        });
        this.borders.push(border);
        return border;
    },

    /**
    * Supported font styles:
    * bold
    * italic
    * underline (single, double, singleAccounting, doubleAccounting)
    * size
    * color
    * fontName
    * strike (strikethrough)
    * outline (does this actually do anything?)
    * shadow (does this actually do anything?)
    * superscript
    * subscript
    *
    * Color is a future goal - at the moment it's looking a bit complicated
    * @param {Object} instructions
    */
    createFontStyle: function (instructions) {
        var fontId = this.fonts.length;
        var fontStyle = {
            id: fontId
        };
        if(instructions.bold) {
            fontStyle.bold = true;
        }
        if(instructions.italic) {
            fontStyle.italic = true;
        }
        if(instructions.superscript) {
            fontStyle.vertAlign = 'superscript';
        }
        if(instructions.subscript) {
            fontStyle.vertAlign = 'subscript';
        }
        if(instructions.underline) {
            if(_.indexOf([
                'double',
                'singleAccounting',
                'doubleAccounting'
                ], instructions.underline) !== -1) {
                fontStyle.underline = instructions.underline;
            } else {
                fontStyle.underline = true;
            }
        }
        if(instructions.strike) {
            fontStyle.strike = true;
        }
        if(instructions.outline) {
            fontStyle.outline = true;
        }
        if(instructions.shadow) {
            fontStyle.shadow = true;
        }
        if(instructions.size) {
            fontStyle.size = instructions.size;
        }
        if(instructions.color) {
            fontStyle.color = instructions.color;
        }
        if(instructions.fontName) {
            fontStyle.fontName = instructions.fontName;
        }
        this.fonts.push(fontStyle);
        return fontStyle;
    },

    exportBorders: function (doc) {
        var borders = doc.createElement('borders');
        borders.setAttribute('count', this.borders.length);

        for(var i = 0, l = this.borders.length; i < l; i++) {
            borders.appendChild(this.exportBorder(doc, this.borders[i]));
        }
        return borders;
    },

    exportBorder: function (doc, data) {
        var border = doc.createElement('border');
        var self = this;
        var borderGenerator = function (name) {
            var b = doc.createElement(name);
            if(data[name].style) {
                b.setAttribute('style', data[name].style);
            }
            if(data[name].color) {
                b.appendChild(self.exportColor(doc, data[name].color));
            }
            return b;
        };
        border.appendChild(borderGenerator('left'));
        border.appendChild(borderGenerator('right'));
        border.appendChild(borderGenerator('top'));
        border.appendChild(borderGenerator('bottom'));
        border.appendChild(borderGenerator('diagonal'));
        return border;
    },

    exportColor: function (doc, color) {
        var colorEl = doc.createElement('color');
        if(_.isString(color)) {
            colorEl.setAttribute('rgb', color);
            return colorEl;
        }

        if (!_.isUndefined(color.tint)) {
            colorEl.setAttribute('tint', color.tint);
        }
        if (!_.isUndefined(color.auto)) {
            colorEl.setAttribute('auto', !!color.auto);
        }
        if (!_.isUndefined(color.theme)) {
            colorEl.setAttribute('theme', color.theme);
        }

        return colorEl;
    },

    exportMasterCellFormats: function (doc) {
        var cellFormats = util.createElement(doc, 'cellXfs', [
            ['count', this.masterCellFormats.length]
            ]);
        for(var i = 0, l = this.masterCellFormats.length; i < l; i++) {
            var mformat = this.masterCellFormats[i];
            cellFormats.appendChild(this.exportCellFormatElement(doc, mformat));
        }
        return cellFormats;
    },

    exportMasterCellStyles: function (doc) {
        var records = util.createElement(doc, 'cellStyleXfs', [
            ['count', this.masterCellStyles.length]
            ]);
        for(var i = 0, l = this.masterCellStyles.length; i < l; i++) {
            var mstyle = this.masterCellStyles[i];
            records.appendChild(this.exportCellFormatElement(doc, mstyle));
        }
        return records;
    },

    exportCellFormatElement: function (doc, styleInstructions) {
        var xf = doc.createElement('xf');
        var allowed = ['applyAlignment', 'applyBorder', 'applyFill', 'applyFont', 'applyNumberFormat',
        'applyProtection', 'borderId', 'fillId', 'fontId', 'numFmtId', 'pivotButton', 'quotePrefix', 'xfId'];
        var attributes = _.filter(_.keys(styleInstructions), function (key) {
            if(_.indexOf(allowed, key) !== -1) {
                return true;
            }
        });
        if(styleInstructions.alignment) {
            var alignmentData = styleInstructions.alignment;
            xf.appendChild(this.exportAlignment(doc, alignmentData));
        }
        if (styleInstructions.protection) {
            xf.appendChild(this.exportProtection(doc, styleInstructions.protection));
            xf.setAttribute('applyProtection', '1');
        }
        var a = attributes.length;
        while(a--) {
            xf.setAttribute(attributes[a], styleInstructions[attributes[a]]);
        }
        if (styleInstructions.fillId) {
            xf.setAttribute('applyFill', '1');
        }
        if (styleInstructions.fontId) {
            xf.setAttribute('applyFont', '1');
        }
        if (styleInstructions.borderId) {
            xf.setAttribute('applyBorder', '1');
        }
        if (styleInstructions.alignment) {
            xf.setAttribute('applyAlignment', '1');
        }
        if (styleInstructions.numFmtId) {
            xf.setAttribute('applyNumberFormat', '1');
        }
        if((styleInstructions.numFmtId !== undefined) && (styleInstructions.xfId === undefined)) {
            xf.setAttribute('xfId', '0');
        }
        return xf;
    },

    exportAlignment: function (doc, alignmentData) {
        var alignment = doc.createElement('alignment');
        var keys = _.keys(alignmentData);
        for(var i = 0, l = keys.length; i < l; i++) {
            alignment.setAttribute(keys[i], alignmentData[keys[i]]);
        }
        return alignment;
    },

    exportFonts: function (doc) {
        var fonts = doc.createElement('fonts');
        fonts.setAttribute('count', this.fonts.length);
        for(var i = 0, l = this.fonts.length; i < l; i++) {
            var fd = this.fonts[i];
            fonts.appendChild(this.exportFont(doc, fd));
        }
        return fonts;
    },

    exportFont: function (doc, fd) {
        var font = doc.createElement('font');
        if(fd.size) {
            var size = doc.createElement('sz');
            size.setAttribute('val', fd.size);
            font.appendChild(size);
        }

        if(fd.fontName) {
            var fontName = doc.createElement('name');
            fontName.setAttribute('val', fd.fontName);
            font.appendChild(fontName);
        }

        if(fd.bold) {
            font.appendChild(doc.createElement('b'));
        }
        if(fd.italic) {
            font.appendChild(doc.createElement('i'));
        }
        if(fd.vertAlign) {
            var vertAlign = doc.createElement('vertAlign');
            vertAlign.setAttribute('val', fd.vertAlign);
            font.appendChild(vertAlign);
        }
        if(fd.underline) {
            var u = doc.createElement('u');
            if(fd.underline !== true) {
                u.setAttribute('val', fd.underline);
            }
            font.appendChild(u);
        }
        if(fd.strike) {
            font.appendChild(doc.createElement('strike'));
        }
        if(fd.shadow) {
            font.appendChild(doc.createElement('shadow'));
        }
        if(fd.outline) {
            font.appendChild(doc.createElement('outline'));
        }
        if(fd.color) {
            font.appendChild(this.exportColor(doc, fd.color));
        }
        return font;
    },

    exportFills: function (doc) {
        var fills = doc.createElement('fills');
        fills.setAttribute('count', this.fills.length);
        for(var i = 0, l = this.fills.length; i < l; i++) {
            var fd = this.fills[i];
            fills.appendChild(this.exportFill(doc, fd));
        }
        return fills;
    },

    exportFill: function (doc, fd) {
        var fillDef;
        var fill = doc.createElement('fill');
        if (fd.type === 'pattern') {
            fillDef = this.exportPatternFill(doc, fd);
            fill.appendChild(fillDef);
        } else if (fd.type === 'gradient') {
            fillDef = this.exportGradientFill(doc, fd);
            fill.appendChild(fillDef);
        }
        return fill;
    },

    exportGradientFill: function (doc, data) {
        var fillDef = doc.createElement('gradientFill');
        if(data.degree) {
            fillDef.setAttribute('degree', data.degree);
        } else if (data.left) {
            fillDef.setAttribute('left', data.left);
            fillDef.setAttribute('right', data.right);
            fillDef.setAttribute('top', data.top);
            fillDef.setAttribute('bottom', data.bottom);
        }
        var start = doc.createElement('stop');
        start.setAttribute('position', data.start.pureAt || 0);
        var startColor = doc.createElement('color');
        if (typeof data.start === 'string' || data.start.color) {
            startColor.setAttribute('rgb', data.start.color || data.start);
        } else if (typeof data.start.theme) {
            startColor.setAttribute('theme', data.start.theme);
        }

        var end = doc.createElement('stop');
        var endColor = doc.createElement('color');
        end.setAttribute('position', data.end.pureAt || 1);
        if (typeof data.start === 'string' || data.end.color) {
            endColor.setAttribute('rgb', data.end.color || data.end);
        } else if (typeof data.end.theme) {
            endColor.setAttribute('theme', data.end.theme);
        }
        start.appendChild(startColor);
        end.appendChild(endColor);
        fillDef.appendChild(start);
        fillDef.appendChild(end);
        return fillDef;
    },

    /**
    * Pattern types: http://www.schemacentral.com/sc/ooxml/t-ssml_ST_PatternType.html
    * @param {XMLDoc} doc
    * @param {Object} data
    */
    exportPatternFill: function (doc, data) {
        var fillDef = util.createElement(doc, 'patternFill', [
            ['patternType', data.patternType]
            ]);
        if(!data.bgColor) {
            data.bgColor = 'FFFFFFFF';
        }
        if(!data.fgColor) {
            data.fgColor = 'FFFFFFFF';
        }

        var bgColor = doc.createElement('bgColor');
        if(_.isString(data.bgColor)) {
            bgColor.setAttribute('rgb', data.bgColor);
        } else {
            if(data.bgColor.theme) {
                bgColor.setAttribute('theme', data.bgColor.theme);
            } else {
                bgColor.setAttribute('rgb', data.bgColor.rbg);
            }
        }

        var fgColor = doc.createElement('fgColor');
        if(_.isString(data.fgColor)) {
            fgColor.setAttribute('rgb', data.fgColor);
        } else {
            if(data.fgColor.theme) {
                fgColor.setAttribute('theme', data.fgColor.theme);
            } else {
                fgColor.setAttribute('rgb', data.fgColor.rbg);
            }
        }
        fillDef.appendChild(fgColor);
        fillDef.appendChild(bgColor);
        return fillDef;
    },

    exportNumberFormatters: function (doc) {
        var formatters = doc.createElement('numFmts');
        formatters.setAttribute('count', this.numberFormatters.length);
        for(var i = 0, l = this.numberFormatters.length; i < l; i++) {
            var fd = this.numberFormatters[i];
            formatters.appendChild(this.exportNumberFormatter(doc, fd));
        }
        return formatters;
    },

    exportNumberFormatter: function (doc, fd) {
        var numFmt = doc.createElement('numFmt');
        numFmt.setAttribute('numFmtId', fd.id);
        numFmt.setAttribute('formatCode', fd.formatCode);
        return numFmt;
    },

    exportCellStyles: function (doc) {
        var cellStyles = doc.createElement('cellStyles');
        cellStyles.setAttribute('count', this.cellStyles.length);

        for(var i = 0, l = this.cellStyles.length; i < l; i++) {
            var style = this.cellStyles[i];
            delete style.id; //Remove internal id
            var record = util.createElement(doc, 'cellStyle');
            cellStyles.appendChild(record);
            var attributes = _.keys(style);
            var a = attributes.length;
            while(a--) {
                record.setAttribute(attributes[a], style[attributes[a]]);
            }
        }

        return cellStyles;
    },

    exportDifferentialStyles: function (doc) {
        var dxfs = doc.createElement('dxfs');
        dxfs.setAttribute('count', this.differentialStyles.length);

        for(var i = 0, l = this.differentialStyles.length; i < l; i++) {
            var style = this.differentialStyles[i];
            dxfs.appendChild(this.exportDFX(doc, style));
        }

        return dxfs;
    },

    exportDFX: function (doc, style) {
        var dxf = doc.createElement('dxf');
        if(style.font) {
            dxf.appendChild(this.exportFont(doc, style.font));
        }
        if(style.fill) {
            dxf.appendChild(this.exportFill(doc, style.fill));
        }
    if(style.border) {
            dxf.appendChild(this.exportBorder(doc, style.border));
        }
        if(style.numFmt) {
            dxf.appendChild(this.exportNumberFormatter(doc, style.numFmt));
        }
        if(style.alignment) {
            dxf.appendChild(this.exportAlignment(doc, style.alignment));
        }
        return dxf;
    },

    exportTableStyles: function (doc) {
        var tableStyles = doc.createElement('tableStyles');
        tableStyles.setAttribute('count', this.tableStyles.length);
        if(this.defaultTableStyle) {
            tableStyles.setAttribute('defaultTableStyle', this.defaultTableStyle);
        }
        for(var i = 0, l = this.tableStyles.length; i < l; i++) {
            tableStyles.appendChild(this.exportTableStyle(doc, this.tableStyles[i]));
        }
        return tableStyles;
    },

    exportTableStyle: function (doc, style) {
        var tableStyle = doc.createElement('tableStyle');
        tableStyle.setAttribute('name', style.name);
        tableStyle.setAttribute('pivot', 0);
        var i = 0;

        _.each(style, function (value, key) {
            if(key === 'name') {return;}
            i++;
            var styleEl = doc.createElement('tableStyleElement');
            styleEl.setAttribute('type', key);
            styleEl.setAttribute('dxfId', value);
            tableStyle.appendChild(styleEl);
        });
        tableStyle.setAttribute('count', i);
        return tableStyle;
    },

    exportProtection: function (doc, protectionData) {
        var node = doc.createElement('protection');
        for (var k in protectionData) {
            if(protectionData.hasOwnProperty(k)) {
                node.setAttribute(k, protectionData[k]);
            }
        }
        return node;
    },

    toXML: function () {
        var doc = util.createXmlDoc(util.schemas.spreadsheetml, 'styleSheet');
        var styleSheet = doc.documentElement;
        styleSheet.appendChild(this.exportNumberFormatters(doc));
        styleSheet.appendChild(this.exportFonts(doc));
        styleSheet.appendChild(this.exportFills(doc));
        styleSheet.appendChild(this.exportBorders(doc));
        styleSheet.appendChild(this.exportMasterCellStyles(doc));
        styleSheet.appendChild(this.exportMasterCellFormats(doc));
        styleSheet.appendChild(this.exportCellStyles(doc));
        styleSheet.appendChild(this.exportDifferentialStyles(doc));
        if(this.tableStyles.length) {
            styleSheet.appendChild(this.exportTableStyles(doc));
        }
        return doc;
    }
});
module.exports = StyleSheet;


/***/ }),

/***/ 496:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {


var _ = __nccwpck_require__(804);
var util = __nccwpck_require__(328);

/**
 * @module Excel/Table
 */

var Table = function (config) {
    _.defaults(this, {
        name: "",
        displayName: "",
        dataCellStyle: null,
        dataDfxId: null,
        headerRowBorderDxfId: null,
        headerRowCellStyle: null,
        headerRowCount: 1,
        headerRowDxfId: null,
        insertRow: false,
        insertRowShift: false,
        ref: null,
        tableBorderDxfId: null,
        totalsRowBorderDxfId: null,
        totalsRowCellStyle: null,
        totalsRowCount: 0,
        totalsRowDxfId: null,
        tableColumns: [],
        autoFilter: null,
        sortState: null,
        styleInfo: {}
    });
    this.initialize(config);
};
_.extend(Table.prototype, {

    initialize: function (config) {
        this.displayName = _.uniqueId("Table");
        this.name = this.displayName;
        this.id = this.name;
        this.tableId = this.id.replace('Table', '');
        _.extend(this, config);
    },

    setReferenceRange: function (start, end) {
        this.ref = [start, end];
    },

    setTableColumns: function (columns) {
        _.each(columns, function (column) {
            this.addTableColumn(column);
        }, this);
    },

    /**
    * Expects an object with the following optional properties:
    * name (required)
    * dataCellStyle
    * dataDxfId
    * headerRowCellStyle
    * headerRowDxfId
    * totalsRowCellStyle
    * totalsRowDxfId
    * totalsRowFunction
    * totalsRowLabel
    * columnFormula
    * columnFormulaIsArrayType (boolean)
    * totalFormula
    * totalFormulaIsArrayType (boolean)
    */
    addTableColumn: function (column) {
        if(_.isString(column)) {
            column = {
                name: column
            };
        }
        if(!column.name) {
            throw "Invalid argument for addTableColumn - minimum requirement is a name property";
        }
        this.tableColumns.push(column);
    },

    /**
    * Expects an object with the following properties:
    * caseSensitive (boolean)
    * dataRange
    * columnSort (assumes true)
    * sortDirection
    * sortRange (defaults to dataRange)
    */
    setSortState: function (state) {
        this.sortState = state;
    },

    toXML: function () {
        var doc = util.createXmlDoc(util.schemas.spreadsheetml, 'table');
        var table = doc.documentElement;
        table.setAttribute('id', this.tableId);
        table.setAttribute('name', this.name);
        table.setAttribute('displayName', this.displayName);
        var s = this.ref[0];
        var e = this.ref[1];
        table.setAttribute('ref', util.positionToLetterRef(s[0], s[1]) + ":" + util.positionToLetterRef(e[0], e[1]));

        /** TOTALS **/
        table.setAttribute('totalsRowCount', this.totalsRowCount);

        /** HEADER **/
        table.setAttribute('headerRowCount', this.headerRowCount);
        if(this.headerRowDxfId) {
            table.setAttribute('headerRowDxfId', this.headerRowDxfId);
        }
        if(this.headerRowBorderDxfId) {
            table.setAttribute('headerRowBorderDxfId', this.headerRowBorderDxfId);
        }

        if(!this.ref) {
            throw "Needs at least a reference range";
        }
        if(!this.autoFilter) {
            this.addAutoFilter(this.ref[0], this.ref[1]);
        }

        table.appendChild(this.exportAutoFilter(doc));

        table.appendChild(this.exportTableColumns(doc));
        table.appendChild(this.exportTableStyleInfo(doc));
        return doc;
    },

    exportTableColumns: function (doc) {
        var tableColumns = doc.createElement('tableColumns');
        tableColumns.setAttribute('count', this.tableColumns.length);
        var tcs = this.tableColumns;
        for(var i = 0, l = tcs.length; i < l; i++) {
            var tc = tcs[i];
            var tableColumn = doc.createElement('tableColumn');
            tableColumn.setAttribute('id', i + 1);
            tableColumn.setAttribute('name', tc.name);
            tableColumns.appendChild(tableColumn);

            if(tc.totalsRowFunction) {
                tableColumn.setAttribute('totalsRowFunction', tc.totalsRowFunction);
            }
            if(tc.totalsRowLabel) {
                tableColumn.setAttribute('totalsRowLabel', tc.totalsRowLabel);
            }
        }
        return tableColumns;
    },

    exportAutoFilter: function (doc) {
        var autoFilter = doc.createElement('autoFilter');
        var s = this.autoFilter[0];
        var e = this.autoFilter[1];
        autoFilter.setAttribute('ref', util.positionToLetterRef(s[0], s[1]) + ":" + util.positionToLetterRef(e[0], e[1]  - this.totalsRowCount));
        return autoFilter;
    },

    exportTableStyleInfo: function (doc) {
        var ts = this.styleInfo;
        var tableStyle = doc.createElement('tableStyleInfo');
        tableStyle.setAttribute('name', ts.themeStyle);
        tableStyle.setAttribute('showFirstColumn', ts.showFirstColumn ? "1" : "0");
        tableStyle.setAttribute('showLastColumn', ts.showLastColumn ? "1" : "0");
        tableStyle.setAttribute('showColumnStripes', ts.showColumnStripes ? "1" : "0");
        tableStyle.setAttribute('showRowStripes', ts.showRowStripes ? "1" : "0");
        return tableStyle;
    },

    addAutoFilter: function (startRef, endRef) {
        this.autoFilter = [startRef, endRef];
    }
});
module.exports = Table;

/***/ }),

/***/ 952:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {


var Q = __nccwpck_require__(434);
var _ = __nccwpck_require__(804);
var util = __nccwpck_require__(328);
var StyleSheet = __nccwpck_require__(747);
var Worksheet = __nccwpck_require__(20);
var SharedStrings = __nccwpck_require__(349);
var RelationshipManager = __nccwpck_require__(785);
var Paths = __nccwpck_require__(255);
var XMLDOM = __nccwpck_require__(543);

/**
 * @module Excel/Workbook
 */
/* globals console: true */

var Workbook = function (config) {
    this.worksheets = [];
    this.tables = [];
    this.drawings = [];
    this.media = {};
    this.initialize(config);
};
_.extend(Workbook.prototype, {

    initialize: function () {
        this.id = _.uniqueId('Workbook');
        this.styleSheet = new StyleSheet();
        this.sharedStrings = new SharedStrings();
        this.relations = new RelationshipManager();
        this.relations.addRelation(this.styleSheet, 'stylesheet');
        this.relations.addRelation(this.sharedStrings, 'sharedStrings');
    },

    createWorksheet: function (config) {
        config = config || {};
        _.defaults(config, {
            name: 'Sheet '.concat(this.worksheets.length + 1)
        });
        return new Worksheet(config);
    },

    getStyleSheet: function () {
        return this.styleSheet;
    },

    addTable: function (table) {
        this.tables.push(table);
    },

    addDrawings: function (drawings) {
        this.drawings.push(drawings);
    },

    /**
     * Set number of rows to repeat for this sheet.
     *
     * @param {String} sheet name
     * @param {int} number of rows to repeat from the top
     * @returns {undefined}
     */
    setPrintTitleTop: function (inSheet, inRowCount) {
    	if (this.printTitles == null) {
    		this.printTitles = {};
    	}
    	if (this.printTitles[inSheet] == null) {
    		this.printTitles[inSheet] = {};
    	}
    	this.printTitles[inSheet].top = inRowCount;
    },

    /**
     * Set number of rows to repeat for this sheet.
     *
     * @param {String} sheet name
     * @param {int} number of columns to repeat from the left
     * @returns {undefined}
     */
    setPrintTitleLeft: function (inSheet, inRowCount) {
    	if (this.printTitles == null) {
    		this.printTitles = {};
    	}
    	if (this.printTitles[inSheet] == null) {
    		this.printTitles[inSheet] = {};
    	}
    	//WARN: this does not handle AA, AB, etc.
    	this.printTitles[inSheet].left = String.fromCharCode(64 + inRowCount);
    },

    addMedia: function (type, fileName, fileData, contentType) {
        var fileNamePieces = fileName.split('.');
        var extension = fileNamePieces[fileNamePieces.length - 1];
        if(!contentType) {
            switch(extension.toLowerCase()) {
                case 'jpeg':
                case 'jpg':
                    contentType = "image/jpeg";
                    break;
                case 'png':
                    contentType = "image/png";
                    break;
                case 'gif':
                    contentType = "image/gif";
                    break;
                default:
                    contentType = null;
                    break;
            }
        }
        if(!this.media[fileName]) {
            this.media[fileName] = {
                id: fileName,
                data: fileData,
                fileName: fileName,
                contentType: contentType,
                extension: extension
            };
        }
        return this.media[fileName];
    },

    addWorksheet: function (worksheet) {
        this.relations.addRelation(worksheet, 'worksheet');
        worksheet.setSharedStringCollection(this.sharedStrings);
        this.worksheets.push(worksheet);
    },

    createContentTypes: function () {
        var doc = util.createXmlDoc(util.schemas.contentTypes, 'Types');
        var types = doc.documentElement;
        var i, l;

        types.appendChild(util.createElement(doc, 'Default', [
            ['Extension', "rels"],
            ['ContentType', "application/vnd.openxmlformats-package.relationships+xml"]
        ]));
        types.appendChild(util.createElement(doc, 'Default', [
            ['Extension', "xml"],
            ['ContentType', "application/xml"]
        ]));

        var extensions = {};
        for(var filename in this.media) {
            if(this.media.hasOwnProperty(filename)) {
                extensions[this.media[filename].extension] = this.media[filename].contentType;
            }
        }
        for(var extension in extensions) {
            if(extensions.hasOwnProperty(extension)) {
                types.appendChild(util.createElement(doc, 'Default', [
                    ['Extension', extension],
                    ['ContentType', extensions[extension]]
                ]));
            }
        }

        types.appendChild(util.createElement(doc, 'Override', [
            ['PartName', "/xl/workbook.xml"],
            ['ContentType', "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"]
        ]));
        types.appendChild(util.createElement(doc, 'Override', [
            ['PartName', "/xl/sharedStrings.xml"],
            ['ContentType', "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"]
        ]));
        types.appendChild(util.createElement(doc, 'Override', [
            ['PartName', "/xl/styles.xml"],
            ['ContentType', "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"]
        ]));

        for(i = 0, l = this.worksheets.length; i < l; i++) {
            types.appendChild(util.createElement(doc, 'Override', [
                ['PartName', "/xl/worksheets/sheet" + (i + 1) + ".xml"],
                ['ContentType', "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"]
            ]));
        }
        for(i = 0, l = this.tables.length; i < l; i++) {
            types.appendChild(util.createElement(doc, 'Override', [
                ['PartName', "/xl/tables/table" + (i + 1) + ".xml"],
                ['ContentType', "application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml"]
            ]));
        }

        for(i = 0, l = this.drawings.length; i < l; i++) {
            types.appendChild(util.createElement(doc, 'Override', [
                ['PartName', '/xl/drawings/drawing' + (i + 1) + '.xml'],
                ['ContentType', 'application/vnd.openxmlformats-officedocument.drawing+xml']
            ]));
        }

        return doc;
    },

    toXML: function () {
        var doc = util.createXmlDoc(util.schemas.spreadsheetml, 'workbook');
        var wb = doc.documentElement;
        wb.setAttribute('xmlns:r', util.schemas.relationships);

        var maxWorksheetNameLength = 31;
        var sheets = util.createElement(doc, 'sheets');
        for(var i = 0, l = this.worksheets.length; i < l; i++) {
            var sheet = doc.createElement('sheet');
            // Microsoft Excel (2007, 2013) do not allow worksheet names longer than 31 characters
            // if the worksheet name is longer, Excel displays an "Excel found unreadable content..." popup when opening the file
            if(typeof console !== "undefined" && this.worksheets[i].name.length > maxWorksheetNameLength) {
                console.log('Microsoft Excel requires work sheet names to be less than ' + (maxWorksheetNameLength+1) +
                        ' characters long, work sheet name "' + this.worksheets[i].name +
                        '" is ' + this.worksheets[i].name.length + ' characters long');
            }
            sheet.setAttribute('name', this.worksheets[i].name);
            sheet.setAttribute('sheetId', i + 1);
            sheet.setAttribute('r:id', this.relations.getRelationshipId(this.worksheets[i]));
            sheets.appendChild(sheet);
        }
        wb.appendChild(sheets);

        //now to add repeating rows
        var definedNames = util.createElement(doc, "definedNames");
        var ctr = 0;
        for (var name in this.printTitles) {
        	if (!this.printTitles.hasOwnProperty(name)) {
    		    continue;
    		}
        	var entry = this.printTitles[name];
        	var definedName = doc.createElement('definedName');
        	definedName.setAttribute("name", "_xlnm.Print_Titles");
        	definedName.setAttribute("localSheetId", ctr++);

        	var value = "";
        	if (entry.top) {
        		value += name + "!$1:$" + entry.top;
        		if (entry.left) {
        			value += ",";
        		}
        	}
        	if (entry.left) {
        		value += name + "!$A:$" + entry.left;
        	}

        	definedName.appendChild(doc.createTextNode(value));
        	definedNames.appendChild(definedName);
        }
        wb.appendChild(definedNames);

        return doc;
    },

    createWorkbookRelationship: function () {
        var doc = util.createXmlDoc(util.schemas.relationshipPackage, 'Relationships');
        var relationships = doc.documentElement;
        relationships.appendChild(util.createElement(doc, 'Relationship', [
            ['Id', 'rId1'],
            ['Type', util.schemas.officeDocument],
            ['Target', 'xl/workbook.xml']
            ]));
        return doc;
    },

    _generateCorePaths: function (files) {
        var i, l;
        Paths[this.styleSheet.id] = 'styles.xml';
        Paths[this.sharedStrings.id] = 'sharedStrings.xml';
        Paths[this.id] = '/xl/workbook.xml';

        for(i = 0, l = this.tables.length; i < l; i++) {
            files['/xl/tables/table' + (i + 1) + '.xml'] = this.tables[i].toXML();
            Paths[this.tables[i].id] = '/xl/tables/table' + (i + 1) + '.xml';
        }

        for(var fileName in this.media) {
            if(this.media.hasOwnProperty(fileName)) {
                var media = this.media[fileName];
                files['/xl/media/' + fileName] = media.data;
                Paths[fileName] = '/xl/media/' + fileName;
            }
        }

        for(i = 0, l = this.drawings.length; i < l; i++) {
            files['/xl/drawings/drawing' + (i + 1) + '.xml'] = this.drawings[i].toXML();
            Paths[this.drawings[i].id] = '/xl/drawings/drawing' + (i + 1) + '.xml';
            files['/xl/drawings/_rels/drawing' + (i + 1) + '.xml.rels'] = this.drawings[i].relations.toXML();
        }


    },

    _prepareFilesForPackaging: function (files) {

        _.extend(files, {
            '/[Content_Types].xml': this.createContentTypes(),
            '/_rels/.rels': this.createWorkbookRelationship(),
            '/xl/styles.xml': this.styleSheet.toXML(),
            '/xl/workbook.xml': this.toXML(),
            '/xl/sharedStrings.xml': this.sharedStrings.toXML(),
            '/xl/_rels/workbook.xml.rels': this.relations.toXML()
        });

        _.each(files, function (value, key) {
            if(key.indexOf('.xml') !== -1 || key.indexOf('.rels') !== -1) {
                if (value instanceof XMLDOM){
                    files[key] = value.toString();
                } else {
                    files[key] = value.xml || new window.XMLSerializer().serializeToString(value);
                }
                var content = files[key].replace(/xmlns=""/g, '');
                content = content.replace(/NS[\d]+:/g, '');
                content = content.replace(/xmlns:NS[\d]+=""/g, '');
                files[key] = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + "\n" + content;
            }
        });
    },

    generateFiles: function () {
        var files = {};
        this._generateCorePaths(files);

        for(var i = 0, l = this.worksheets.length; i < l; i++) {
            files['/xl/worksheets/sheet' + (i + 1) + '.xml'] = this.worksheets[i].toXML();
            Paths[this.worksheets[i].id] = 'worksheets/sheet' + (i + 1) + '.xml';
            files['/xl/worksheets/_rels/sheet' + (i + 1) + '.xml.rels'] = this.worksheets[i].relations.toXML();
        }

        this._prepareFilesForPackaging(files);

        return Q.resolve(files);
    }
});
module.exports = Workbook;


/***/ }),

/***/ 20:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {


var _ = __nccwpck_require__(804);
var util = __nccwpck_require__(328);
var RelationshipManager = __nccwpck_require__(785);
var SheetView = __nccwpck_require__(958);

/**
 * This module represents an excel worksheet in its basic form - no tables, charts, etc. Its purpose is
 * to hold data, the data's link to how it should be styled, and any links to other outside resources.
 *
 * @module Excel/Worksheet
 */
    var Worksheet = function (config) {
        this.relations = null;
        this.columnFormats = [];
        this.data = [];
        this.mergedCells = [];
        this.columns = [];
        this.sheetProtection = false;
        this._headers = [];
        this._footers = [];
        this._tables = [];
        this._drawings = [];
        this._rowInstructions = {};
        this._freezePane = {};

        this.hyperlinks = [];
        this.sheetView = config.sheetView || new SheetView();

        this.showZeros = null;
        this.initialize(config);
    };
    _.extend(Worksheet.prototype, {

        initialize: function (config) {
            config = config || {};
            this.name = config.name;
            this.id = _.uniqueId('Worksheet');
            this._timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
            if(config.columns) {
                this.setColumns(config.columns);
            }

            this.relations = new RelationshipManager();
        },

        /**
         * Returns an object that can be consumed by a WorksheetExportWorker
         * @returns {Object}
         */
        exportData: function () {
            return {
                relations: this.relations.exportData(),
                columnFormats: this.columnFormats,
                data: this.data,
                columns: this.columns,
                mergedCells: this.mergedCells,
                _headers: this._headers,
                _footers: this._footers,
                _tables: this._tables,
                _rowInstructions: this._rowInstructions,
                _freezePane: this._freezePane,
                name: this.name,
                id: this.id
            };
        },

        /**
         * Imports data - to be used while inside of a WorksheetExportWorker.
         * @param {Object} data
         */
        importData: function (data) {
            this.relations.importData(data.relations);
            delete data.relations;
            _.extend(this, data);
        },

        setSharedStringCollection: function (stringCollection) {
            this.sharedStrings = stringCollection;
        },

        addTable: function (table) {
            this._tables.push(table);
            this.relations.addRelation(table, 'table');
        },

        addDrawings: function (table) {
            this._drawings.push(table);
            this.relations.addRelation(table, 'drawingRelationship');
        },

        setRowInstructions: function (rowIndex, instructions) {
            this._rowInstructions[rowIndex] = instructions;
        },

        /**
        * Expects an array length of three.
        *
        * @see Excel/Worksheet compilePageDetailPiece
        * @see <a href='/cookbook/addingHeadersAndFooters.html'>Adding headers and footers to a worksheet</a>
        *
        * @param {Array} headers [left, center, right]
        */
        setHeader: function (headers) {
            if(!_.isArray(headers)) {
                throw "Invalid argument type - setHeader expects an array of three instructions";
            }
            this._headers = headers;
        },

        /**
        * Expects an array length of three.
        *
        * @see Excel/Worksheet compilePageDetailPiece
        * @see <a href='/cookbook/addingHeadersAndFooters.html'>Adding headers and footers to a worksheet</a>
        *
        * @param {Array} footers [left, center, right]
        */
        setFooter: function (footers) {
            if(!_.isArray(footers)) {
                throw "Invalid argument type - setFooter expects an array of three instructions";
            }
            this._footers = footers;
        },

        /**
         * Turns page header/footer details into the proper format for Excel.
         * @param {type} data
         * @returns {String}
         */
        compilePageDetailPackage: function (data) {
            data = data || "";
            return [
            "&L", this.compilePageDetailPiece(data[0] || ""),
            "&C", this.compilePageDetailPiece(data[1] || ""),
            "&R", this.compilePageDetailPiece(data[2] || "")
            ].join('');
        },

        /**
         * Turns instructions on page header/footer details into something
         * usable by Excel.
         *
         * @param {type} data
         * @returns {String|@exp;_@call;reduce}
         */
        compilePageDetailPiece: function (data) {
            if(_.isString(data)) {
                return '&"-,Regular"'.concat(data);
            }
            if(_.isObject(data) && !_.isArray(data)) {
                var string = "";
                if(data.font || data.bold) {
                    var weighting = data.bold ? "Bold" : "Regular";
                    string += '&"' + (data.font || '-');
                    string += ',' + weighting + '"';
                } else {
                    string += '&"-,Regular"';
                }
                if(data.underline) {
                    string += "&U";
                }
                if(data.fontSize) {
                    string += "&"+data.fontSize;
                }
                string += data.text;

                return string;
            }

            if(_.isArray(data)) {
                var self = this;
                return _.reduce(data, function (m, v) {
                    return m.concat(self.compilePageDetailPiece(v));
                }, "");
            }
        },

        /**
         * Creates the header node.
         *
         * @todo implement the ability to do even/odd headers
         * @param {XML Doc} doc
         * @returns {XML Node}
         */
        exportHeader: function (doc) {
            var oddHeader = doc.createElement('oddHeader');
            oddHeader.appendChild(doc.createTextNode(this.compilePageDetailPackage(this._headers)));
            return oddHeader;
        },

        /**
         * Creates the footer node.
         *
         * @todo implement the ability to do even/odd footers
         * @param {XML Doc} doc
         * @returns {XML Node}
         */
        exportFooter: function (doc) {
            var oddFooter = doc.createElement('oddFooter');
            oddFooter.appendChild(doc.createTextNode(this.compilePageDetailPackage(this._footers)));
            return oddFooter;
        },

        /**
         * This creates some nodes ahead of time, which cuts down on generation time due to
         * most cell definitions being essentially the same, but having multiple nodes that need
         * to be created. Cloning takes less time than creation.
         *
         * @private
         * @param {XML Doc} doc
         * @returns {_L8.Anonym$0._buildCache.Anonym$2}
         */
        _buildCache: function (doc) {
            var numberNode = doc.createElement('c');
            var value = doc.createElement('v');
            value.appendChild(doc.createTextNode("--temp--"));
            numberNode.appendChild(value);

            var formulaNode = doc.createElement('c');
            var formulaValue = doc.createElement('f');
            formulaValue.appendChild(doc.createTextNode("--temp--"));
            formulaNode.appendChild(formulaValue);

            var stringNode = doc.createElement('c');
            stringNode.setAttribute('t', 's');
            var stringValue = doc.createElement('v');
            stringValue.appendChild(doc.createTextNode("--temp--"));
            stringNode.appendChild(stringValue);


            return {
                number: numberNode,
                date: numberNode,
                string: stringNode,
                formula: formulaNode
            };
        },

        /**
         * Runs through the XML document and grabs all of the strings that will
         * be sent to the 'shared strings' document.
         *
         * @returns {Array}
         */
        collectSharedStrings: function () {
            var data = this.data;
            var maxX = 0;
            var strings = {};
            for(var row = 0, l = data.length; row < l; row++) {
                var dataRow = data[row];
                var cellCount = dataRow.length;
                maxX = cellCount > maxX ? cellCount : maxX;
                for(var c = 0; c < cellCount; c++) {
                    var cellValue = dataRow[c];
                    var metadata = cellValue && cellValue.metadata || {};
                    if (cellValue && typeof cellValue === 'object') {
                        cellValue = cellValue.value;
                    }

                    if(!metadata.type) {
                        if(typeof cellValue === 'number') {
                            metadata.type = 'number';
                        }
                    }
                    if(metadata.type === "text" || !metadata.type) {
                        if(typeof strings[cellValue] === 'undefined') {
                            strings[cellValue] = true;
                        }
                    }
                }
            }
            return _.keys(strings);
        },

        toXML: function () {
            var data = this.data;
            var columns = this.columns || [];
            var doc = util.createXmlDoc(util.schemas.spreadsheetml, 'worksheet');
            var worksheet = doc.documentElement;
            var i, l, row;
            worksheet.setAttribute('xmlns:r', util.schemas.relationships);
            worksheet.setAttribute('xmlns:mc', util.schemas.markupCompat);

            var maxX = 0;
            var sheetData = util.createElement(doc, 'sheetData');

            var cellCache = this._buildCache(doc);

            for(row = 0, l = data.length; row < l; row++) {
                var dataRow = data[row];
                var cellCount = dataRow.length;
                maxX = cellCount > maxX ? cellCount : maxX;
                var rowNode = doc.createElement('row');

                for(var c = 0; c < cellCount; c++) {
                    columns[c] = columns[c] || {};
                    var cellValue = dataRow[c];
                    var cell, metadata = cellValue && cellValue.metadata || {};

                    if (cellValue && typeof cellValue === 'object') {
                        cellValue = cellValue.value;
                    }

                    if(!metadata.type) {
                        if(typeof cellValue === 'number') {
                            metadata.type = 'number';
                        }
                    }

                    switch(metadata.type) {
                        case "number":
                            cell = cellCache.number.cloneNode(true);
                            cell.firstChild.firstChild.nodeValue = cellValue;
                            break;
                        case "date":
                            cell = cellCache.date.cloneNode(true);
                            cell.firstChild.firstChild.nodeValue = 25569.0 + ((cellValue - this._timezoneOffset)  / (60 * 60 * 24 * 1000));
                            break;
                        case "formula":
                            cell = cellCache.formula.cloneNode(true);
                            cell.firstChild.firstChild.nodeValue = cellValue;
                            break;
                        case "text":
                            /*falls through*/
                        default:
                            var id;
                            if(typeof this.sharedStrings.strings[cellValue] !== 'undefined') {
                                id = this.sharedStrings.strings[cellValue];
                            } else {
                                id = this.sharedStrings.addString(cellValue);
                            }
                            cell = cellCache.string.cloneNode(true);
                            cell.firstChild.firstChild.nodeValue = id;
                            break;
                    }
                    if(metadata.style) {
                        cell.setAttribute('s', metadata.style);
                    } else if (this._rowInstructions[row] && this._rowInstructions[row].style !== undefined) {
                        cell.setAttribute('s', this._rowInstructions[row].style);
                    }
                    cell.setAttribute('r', util.positionToLetterRef(c + 1, row + 1));
                    rowNode.appendChild(cell);
                }
                rowNode.setAttribute('r', row + 1);

                if (this._rowInstructions[row]) {
                    var rowInst = this._rowInstructions[row];

                    if (rowInst.height !== undefined) {
                        rowNode.setAttribute('customHeight', '1');
                        rowNode.setAttribute('ht', rowInst.height);
                    }

                    if (rowInst.style !== undefined) {
                      rowNode.setAttribute('customFormat', '1');
                      rowNode.setAttribute('s', rowInst.style);
                    }
                }

                sheetData.appendChild(rowNode);
            }

            if(maxX !== 0) {
                worksheet.appendChild(util.createElement(doc, 'dimension', [
                    ['ref',  util.positionToLetterRef(1, 1) + ':' + util.positionToLetterRef(maxX, data.length)]
                ]));
            } else {
                worksheet.appendChild(util.createElement(doc, 'dimension', [
                    ['ref',  util.positionToLetterRef(1, 1)]
                ]));
            }

            worksheet.appendChild(this.sheetView.exportXML(doc));

            if(this.columns.length) {
                worksheet.appendChild(this.exportColumns(doc));
            }
            worksheet.appendChild(sheetData);

            // The spec doesn't say anything about this, but Excel 2013 requires sheetProtection immediately after sheetData
            if (this.sheetProtection) {
                worksheet.appendChild(this.sheetProtection.exportXML(doc));
            }

            /**
             * Doing this a bit differently, as hyperlinks could be as populous as rows. Looping twice would be bad.
             */
            if(this.hyperlinks.length > 0) {
                var hyperlinksEl = doc.createElement('hyperlinks');
                var hyperlinks = this.hyperlinks;
                for( i = 0, l = hyperlinks.length; i < l; i++) {
                    var hyperlinkEl = doc.createElement('hyperlink'),
                        hyperlink = hyperlinks[i];
                    hyperlinkEl.setAttribute('ref', hyperlink.cell);
                    hyperlink.id = util.uniqueId('hyperlink');
                    this.relations.addRelation({
                        id: hyperlink.id,
                        target: hyperlink.location,
                        targetMode: hyperlink.targetMode || 'External'
                    }, 'hyperlink');
                    hyperlinkEl.setAttribute('r:id', this.relations.getRelationshipId(hyperlink));
                    hyperlinksEl.appendChild(hyperlinkEl);
                }
                worksheet.appendChild(hyperlinksEl);
            }

            // 'mergeCells' should be written before 'headerFoot' and 'drawing' due to issue
            // with Microsoft Excel (2007, 2013)
            if (this.mergedCells.length > 0) {
                var mergeCells = doc.createElement('mergeCells');
                for (i = 0, l = this.mergedCells.length; i < l; i++) {
                    var mergeCell = doc.createElement('mergeCell');
                    mergeCell.setAttribute('ref', this.mergedCells[i][0] + ':' + this.mergedCells[i][1]);
                    mergeCells.appendChild(mergeCell);
                }
                worksheet.appendChild(mergeCells);
            }

            this.exportPageSettings(doc, worksheet);

            if(this._headers.length > 0 || this._footers.length > 0) {
                var headerFooter = doc.createElement('headerFooter');
                if(this._headers.length > 0) {
                    headerFooter.appendChild(this.exportHeader(doc));
                }
                if(this._footers.length > 0) {
                    headerFooter.appendChild(this.exportFooter(doc));
                }
                worksheet.appendChild(headerFooter);
            }

            // the 'drawing' element should be written last, after 'headerFooter', 'mergeCells', etc. due
            // to issue with Microsoft Excel (2007, 2013)
            for(i = 0, l = this._drawings.length; i < l; i++) {
                var drawing = doc.createElement('drawing');
                drawing.setAttribute('r:id', this.relations.getRelationshipId(this._drawings[i]));
                worksheet.appendChild(drawing);
            }

            if(this._tables.length > 0) {
                var tables = doc.createElement('tableParts');
                tables.setAttribute('count', this._tables.length);
                for(i = 0, l = this._tables.length; i < l; i++) {
                    var table = doc.createElement('tablePart');
                    table.setAttribute('r:id', this.relations.getRelationshipId(this._tables[i]));
                    tables.appendChild(table);
                }
                worksheet.appendChild(tables);
            }
            return doc;
        },

        /**
         *
         * @param {XML Doc} doc
         * @returns {XML Node}
         */
        exportColumns: function (doc) {
            var cols = util.createElement(doc, 'cols');
            for(var i = 0, l = this.columns.length; i < l; i++) {
                var cd = this.columns[i];
                var col = util.createElement(doc, 'col', [
                    ['min', cd.min || i + 1],
                    ['max', cd.max || i + 1]
                ]);
                if (cd.hidden) {
                    col.setAttribute('hidden', 1);
                }
                if(cd.bestFit) {
                    col.setAttribute('bestFit', 1);
                }
                if(cd.customWidth || cd.width) {
                    col.setAttribute('customWidth', 1);
                }
                if(cd.width) {
                    col.setAttribute('width', cd.width);
                } else {
                    col.setAttribute('width', 9.140625);
                }

                cols.appendChild(col);
            }
            return cols;
        },

        /**
         * Sets the page settings on a worksheet node.
         *
         * @param {XML Doc} doc
         * @param {XML Node} worksheet
         * @returns {undefined}
         */
        exportPageSettings: function (doc, worksheet) {
            if(this._margin) {
            	var defaultVal = 0.7;
            	var left = this._margin.left?this._margin.left:defaultVal;
            	var right = this._margin.right?this._margin.right:defaultVal;
            	var top = this._margin.top?this._margin.top:defaultVal;
            	var bottom = this._margin.bottom?this._margin.bottom:defaultVal;
            	defaultVal = 0.3;
            	var header = this._margin.header?this._margin.header:defaultVal;
            	var footer = this._margin.footer?this._margin.footer:defaultVal;

            	worksheet.appendChild(util.createElement(doc, 'pageMargins', [
                    ['top', top],
                    ['bottom', bottom],
                    ['left', left],
                    ['right', right],
                    ['header', header],
                    ['footer', footer]
                ]));
            }
            if(this._orientation) {
                worksheet.appendChild(util.createElement(doc, 'pageSetup', [
                    ['orientation', this._orientation]
                ]));
            }
        },

        /**
         * http://www.schemacentral.com/sc/ooxml/t-ssml_ST_Orientation.html
         *
         * Can be one of 'portrait' or 'landscape'.
         *
         * @param {String} orientation
         * @returns {undefined}
         */
        setPageOrientation: function (orientation) {
            this._orientation = orientation;
        },

        /**
         * Set page details in inches.
         * use this structure:
         * {
         *   top: 0.7
         *   , bottom: 0.7
         *   , left: 0.7
         *   , right: 0.7
         *   , header: 0.3
         *   , footer: 0.3
         * }
         *
         * @returns {undefined}
         */
        setPageMargin: function (input) {
        	this._margin = input;
        },

        /**
         * Expects an array of column definitions. Each column definition needs to have a width assigned to it.
         *
         * @param {Array} columns
         */
        setColumns: function (columns) {
            this.columns = columns;
        },

        /**
         * Expects an array of data to be translated into cells.
         *
         * @param {Array} data Two dimensional array - [ [A1, A2], [B1, B2] ]
         * @see <a href='/cookbook/addingDataToAWorksheet.html'>Adding data to a worksheet</a>
         */
        setData: function (data) {
            this.data = data;
        },

        /**
         * Merge cells in given range
         *
         * @param cell1 - A1, A2...
         * @param cell2 - A2, A3...
         */
        mergeCells: function(cell1, cell2) {
            this.mergedCells.push([cell1, cell2]);
        },

        /**
         * Added froze pane
         * @param column - column number: 0, 1, 2 ...
         * @param row - row number: 0, 1, 2 ...
         * @param cell - 'A1'
         * @deprecated
         */
        freezePane: function(column, row, cell) {
            this.sheetView.freezePane(column, row, cell);
        },

        /**
         * Expects an array containing an object full of column format definitions.
         * http://msdn.microsoft.com/en-us/library/documentformat.openxml.spreadsheet.column.aspx
         * bestFit
         * collapsed
         * customWidth
         * hidden
         * max
         * min
         * outlineLevel
         * phonetic
         * style
         * width
         * @param {Array} columnFormats
         */
        setColumnFormats: function (columnFormats) {
            this.columnFormats = columnFormats;
        }
    });
    module.exports = Worksheet;


/***/ }),

/***/ 543:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {


var _ = __nccwpck_require__(804);

var XMLDOM = function (ns, rootNodeName) {
    this.documentElement = this.createElement(rootNodeName);
    this.documentElement.setAttribute('xmlns', ns);
};

_.extend(XMLDOM.prototype, {
    createElement: function (name) {
        return new XMLDOM.XMLNode({
            nodeName: name
        });
    },
    createTextNode: function (text) {
        return new XMLDOM.TextNode(text);
    },
    toString: function () {
        return this.documentElement.toString();
    }
});

XMLDOM.Node = function () {};
XMLDOM.Node.Create = function (config) {
    switch(config.type) {
        case "XML":
            return new XMLDOM.XMLNode(config);
        case "TEXT":
            return new XMLDOM.TextNode(config.nodeValue);
    }
};

XMLDOM.TextNode = function (text) {
    this.nodeValue = text;
};
 _.extend(XMLDOM.TextNode.prototype, {
     toJSON: function () {
         return {
             nodeValue: this.nodeValue,
             type: 'TEXT'
         };
     },
    toString: function () {
        return _.escape(this.nodeValue);
    }
 });

XMLDOM.XMLNode = function (config) {
    this.nodeName = config.nodeName;
    this.children = [];
    this.nodeValue = config.nodeValue || "";
    this.attributes = {};

    if(config.children) {
        for(var i = 0, l = config.children.length; i < l; i++) {
            this.appendChild(XMLDOM.Node.Create(config.children[i]));
        }
    }

    if(config.attributes) {
        for(var attr in config.attributes) {
            if(config.attributes.hasOwnProperty(attr)) {
                this.setAttribute(attr, config.attributes[attr]);
            }
        }
    }
};
_.extend(XMLDOM.XMLNode.prototype, {

    toString: function () {
        var string = "<" + this.nodeName;
        for(var attr in this.attributes) {
            if(this.attributes.hasOwnProperty(attr)) {
                string = string + " " + attr + "=\""+_.escape(this.attributes[attr])+"\"";
            }
        }

        var childContent = "";
        for(var i = 0, l = this.children.length; i < l; i++) {
            childContent += this.children[i].toString();
        }

        if (childContent){
            string +=  ">" + childContent + "</" + this.nodeName + ">";
        } else {
            string += "/>";
        }

        return string;
    },

    toJSON: function () {
        var children = [];
        for(var i = 0, l = this.children.length; i < l; i++) {
            children.push(this.children[i].toJSON());
        }
        return {
            nodeName: this.nodeName,
            children: children,
            nodeValue: this.nodeValue,
            attributes: this.attributes,
            type: "XML"
        };
    },

    setAttribute: function (name, val) {
        if(val === null) {
            delete this.attributes[name];
            delete this[name];
            return;
        }
        this.attributes[name] = val;
        this[name] = val;
    },
    appendChild: function (child) {
        this.children.push(child);
        this.firstChild = this.children[0];
    },
    cloneNode: function () {
        return new XMLDOM.XMLNode(this.toJSON());
    }
});

module.exports = XMLDOM;

/***/ }),

/***/ 328:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {


var XMLDOM = __nccwpck_require__(543);
var _ = __nccwpck_require__(804);
/**
 * @module Excel/util
 */

var util = {

    _idSpaces: {},

    /**
     * Returns a number based on a namespace. So, running with 'Picture' will return 1. Run again, you will get 2. Run with 'Foo', you'll get 1.
     * @param {String} space
     * @returns {Number}
     */
    uniqueId: function (space) {
        if(!this._idSpaces[space]) {
            this._idSpaces[space] = 1;
        }
        return this._idSpaces[space]++;
    },

    /**
     * Attempts to create an XML document. After some investigation, using the 'fake' document
     * is significantly faster than creating an actual XML document, so we're going to go with
     * that. Besides, it just makes it easier to port to node.
     *
     * Takes a namespace to start the xml file in, as well as the root element
     * of the xml file.
     *
     * @param {type} ns
     * @param {type} base
     * @returns {@new;XMLDOM}
     */
    createXmlDoc: function (ns, base) {
        return new XMLDOM(ns || null, base, null);
    },

    /**
     * Creates an xml node (element). Used to simplify some calls, as IE is
     * very particular about namespaces and such.
     *
     * @param {XMLDOM} doc An xml document (actual DOM or fake DOM, not a string)
     * @param {type} name The name of the element
     * @param {type} attributes
     * @returns {XML Node}
     */
    createElement: function (doc, name, attributes) {
        var el = doc.createElement(name);
        attributes = attributes || [];
        var i = attributes.length;
        while (i--) {
            el.setAttribute(attributes[i][0], attributes[i][1]);
        }
        return el;
    },

    /**
     * This is sort of slow, but it's a huge convenience method for the code. It probably shouldn't be used
     * in high repetition areas.
     *
     * @param {XMLDoc} doc
     * @param {Object} attrs
     */
    setAttributesOnDoc: function (doc, attrs) {
        _.forEach(attrs, function (v, k) {
            if(_.isPlainObject(v)) {
                if(v.v !== null && v.v !== undefined) {
                    switch(v.type) {
                        case Boolean:
                            v = v.v ? '1' : '0';
                            break;
                    }
                } else {
                    v = null;
                }
            }
            if(v !== null && v !== undefined) {
                doc.setAttribute(k, v);
            }
        });
    },

    LETTER_REFS: {},

    positionToLetterRef: function (x, y) {
        var digit = 1, index, num = x, string = "", alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if(this.LETTER_REFS[x]) {
            return this.LETTER_REFS[x].concat(y);
        }
        while (num > 0) {
            num -= Math.pow(26, digit -1);
            index = num % Math.pow(26, digit);
            num -= index;
            index = index / Math.pow(26, digit - 1);
            string = alphabet.charAt(index) + string;
            digit += 1;
        }
        this.LETTER_REFS[x] = string;
        return string.concat(y);
    },

    schemas: {
        'worksheet': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet',
        'sharedStrings': "http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings",
        'stylesheet': "http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles",
        'relationships': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
        'relationshipPackage': "http://schemas.openxmlformats.org/package/2006/relationships",
        'contentTypes': "http://schemas.openxmlformats.org/package/2006/content-types",
        'spreadsheetml': "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
        'markupCompat': "http://schemas.openxmlformats.org/markup-compatibility/2006",
        'x14ac': "http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac",
        'officeDocument': "http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument",
        'package': "http://schemas.openxmlformats.org/package/2006/relationships",
        'table': "http://schemas.openxmlformats.org/officeDocument/2006/relationships/table",
        'spreadsheetDrawing': 'http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing',
        'drawing': 'http://schemas.openxmlformats.org/drawingml/2006/main',
        'drawingRelationship': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing',
        'image': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/image',
        'chart': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart',
        'hyperlink': "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink"
    }
};

module.exports = util;


/***/ }),

/***/ 450:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {



var Workbook = __nccwpck_require__(952);
var Table = __nccwpck_require__(496);
var _ = __nccwpck_require__(804);

var Template = function (worksheetConstructorSettings) {
    this.workbook = new Workbook();
    this.stylesheet = this.workbook.getStyleSheet();

    this.columns = {};

    this.predefinedStyles = {

    };

    this.predefinedFormatters = {
        date: this.stylesheet.createSimpleFormatter('date'),
        currency: this.stylesheet.createFormat({format: "$ #,##0.00;$ #,##0.00;-", font: {color: "FFE9F50A"}}),
        header: this.stylesheet.createFormat({
            font: { bold: true, underline: true, color: {theme: 3}},
            alignment: {horizontal: 'center'}
        })
    };

    if(worksheetConstructorSettings != null) {
        this.worksheet = this.workbook.createWorksheet(worksheetConstructorSettings);
    }
    else {
        this.worksheet = this.workbook.createWorksheet();
    }
    this.workbook.addWorksheet(this.worksheet);
    this.worksheet.setPageOrientation('landscape');
    this.table = new Table();
    this.table.styleInfo.themeStyle = "TableStyleLight1";
    this.worksheet.addTable(this.table);
    this.workbook.addTable(this.table);
};

_.extend(Template.prototype, {
    setHeader: function () {
        this.worksheet.setHeader.apply(this.worksheet, arguments);
    },
    setFooter: function () {
        this.worksheet.setFooter.apply(this.worksheet, arguments);
    },
    prepare: function () {
        return this.workbook;
    },

    setData: function (worksheetData) {
        this.worksheet.setData(worksheetData);
        this.data = worksheetData;
        this.table.setReferenceRange([1, 1], [this.columns.length, worksheetData.length]);
    },

    setColumns: function (columns) {
        this.columns = columns;
        this.worksheet.setColumns(columns);
        this.table.setTableColumns(columns);
        this.table.setReferenceRange([1, 1], [this.columns.length, this.data.length]);
    },

    getWorksheet: function () {
        return this.worksheet;
    }
});

module.exports = Template;


/***/ }),

/***/ 133:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {


module.exports = {
    BasicReport: __nccwpck_require__(450)
};


/***/ }),

/***/ 396:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {


var _ = __nccwpck_require__(804);
var Workbook = __nccwpck_require__(952);
var JSZip = __nccwpck_require__(395);
//var WorkbookWorker = require('./Worker');

/**
 * @name Excel
 * @public
 * @author Stephen Liberty
 * @requires underscore
 * @requires Excel/Workbook
 * @requires JSZIP
 * @exports excel-builder
 */
var Factory = {
    /**
     * Creates a new workbook.
     */
    createWorkbook: function () {
        return new Workbook();
    },

    config: {
        forceUIThread: false
    },

    /**
     * Turns a workbook into a downloadable file.
     * @param {Excel/Workbook} workbook The workbook that is being converted
     * @param {Object} options - options to modify how the zip is created. See http://stuk.github.io/jszip/#doc_generate_options
     * @returns {Promise}
     */
    createFile: function (workbook, options) {
        var zip = new JSZip();
        return workbook.generateFiles().then(function (files) {
            _.each(files, function (content, path) {
                path = path.substr(1);
                if(path.indexOf('.xml') !== -1 || path.indexOf('.rel') !== -1) {
                    zip.file(path, content, {base64: false});
                } else {
                    zip.file(path, content, {base64: true, binary: true});
                }
            });
            return zip.generateAsync(_.defaults(options || {}, {
                type: "base64"
            }));
        });
    }
};


module.exports = Factory;


/***/ }),

/***/ 351:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {



var EBExport = module.exports = {
    Drawings: __nccwpck_require__(861),
    Drawing: __nccwpck_require__(890),
    Pane: __nccwpck_require__(753),
    Paths: __nccwpck_require__(255),
    Positioning: __nccwpck_require__(864),
    RelationshipManager: __nccwpck_require__(785),
    SharedStrings: __nccwpck_require__(349),
    SheetView: __nccwpck_require__(958),
    StyleSheet: __nccwpck_require__(747),
    Table: __nccwpck_require__(496),
    util: __nccwpck_require__(328),
    Workbook: __nccwpck_require__(952),
    Worksheet: __nccwpck_require__(20),
    XMLDOM: __nccwpck_require__(543),
    Builder: __nccwpck_require__(396),
    Template: __nccwpck_require__(133)
};

try {
    if(typeof window !== 'undefined') {
        window.ExcelBuilder = EBExport;
    }
} catch (e) {
    //Silently ignore?
    console.info("Not attaching EB to window");
}


/***/ }),

/***/ 395:
/***/ (function(module) {

module.exports = require("jszip");;

/***/ }),

/***/ 804:
/***/ (function(module) {

module.exports = require("lodash");;

/***/ }),

/***/ 434:
/***/ (function(module) {

module.exports = require("q");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	var __dirname = typeof __dirname !== 'undefined' ? __dirname : "";
/******/ 	__nccwpck_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __nccwpck_require__(351);
/******/ })()
;