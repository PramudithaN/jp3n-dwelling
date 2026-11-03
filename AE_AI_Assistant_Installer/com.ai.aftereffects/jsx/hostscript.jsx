// hostscript.jsx - After Effects ExtendScript Engine

function createDemoComp(titleText) {
    try {
        app.beginUndoGroup("Create AI Title Animation");

        // 1. Ensure project exists
        var proj = app.project;
        if (!proj) {
            proj = app.newProject();
        }

        // 2. Create Comp (1920x1080, 30fps, 5 seconds)
        var compName = "AI Title Comp";
        var comp = proj.items.addComp(compName, 1920, 1080, 1, 5, 30);
        comp.openInViewer();

        // 3. Add Background Solid
        var bgSolid = comp.layers.addSolid([0.08, 0.09, 0.12], "Dark Background", 1920, 1080, 1, 5);

        // 4. Add Text Layer
        var textContent = titleText ? titleText : "AI GENERATED TITLE";
        var textLayer = comp.layers.addText(textContent);

        // 5. Position in center
        var textProp = textLayer.property("Source Text");
        var textDocument = textProp.value;
        textDocument.fontSize = 80;
        textDocument.fillColor = [1, 1, 1];
        textDocument.justification = ParagraphJustification.CENTER_JUSTIFY;
        textProp.setValue(textDocument);

        textLayer.property("Position").setValue([960, 540]);

        // 6. Animate Scale (Pop/Bounce in)
        var scaleProp = textLayer.property("Scale");
        scaleProp.setValueAtTime(0, [0, 0]);
        scaleProp.setValueAtTime(0.4, [115, 115]);
        scaleProp.setValueAtTime(0.6, [95, 95]);
        scaleProp.setValueAtTime(0.8, [100, 100]);

        // 7. Animate Opacity (Fade in)
        var opacityProp = textLayer.property("Opacity");
        opacityProp.setValueAtTime(0, 0);
        opacityProp.setValueAtTime(0.3, 100);

        app.endUndoGroup();
        return "SUCCESS: Created composition '" + compName + "' with animated text!";
    } catch (e) {
        return "ERROR: " + e.toString();
    }
}

function addWiggleToSelected() {
    try {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return "ERROR: Please select a composition first.";
        }

        var selectedLayers = comp.selectedLayers;
        if (selectedLayers.length === 0) {
            return "ERROR: Please select at least one layer to add wiggle.";
        }

        app.beginUndoGroup("Add AI Wiggle");
        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            var pos = layer.property("Position");
            if (pos && pos.canSetExpression) {
                pos.expression = "wiggle(3, 30);";
            }
        }
        app.endUndoGroup();

        return "SUCCESS: Added smooth wiggle to " + selectedLayers.length + " layer(s)!";
    } catch (e) {
        return "ERROR: " + e.toString();
    }
}

function addFadeToSelected() {
    try {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return "ERROR: Please open a composition first.";
        }

        var selectedLayers = comp.selectedLayers;
        if (selectedLayers.length === 0) {
            return "ERROR: Please select at least one layer.";
        }

        app.beginUndoGroup("Add Fade In/Out");
        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            var op = layer.property("Opacity");
            if (op) {
                var inPt = layer.inPoint;
                var outPt = layer.outPoint;
                op.setValueAtTime(inPt, 0);
                op.setValueAtTime(inPt + 0.5, 100);
                op.setValueAtTime(outPt - 0.5, 100);
                op.setValueAtTime(outPt, 0);
            }
        }
        app.endUndoGroup();

        return "SUCCESS: Added 0.5s fade in/out to selected layer(s)!";
    } catch (e) {
        return "ERROR: " + e.toString();
    }
}

function evalCustomScript(code) {
    try {
        app.beginUndoGroup("AI Custom Command");
        var res = eval(code);
        app.endUndoGroup();
        return "SUCCESS: " + (res !== undefined ? String(res) : "Executed successfully");
    } catch (e) {
        return "ERROR: " + e.toString();
    }
}
