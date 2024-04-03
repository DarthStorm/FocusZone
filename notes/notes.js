json = localStorage.getItem("notes")
if (!json) {
    localStorage.setItem("notes","{}");
    json = "{}";
}



const editor = new EditorJS({
    tools: {
        header: Header,
        quote: Quote,
        image: SimpleImage,
        list: {
            class: NestedList,
            inlineToolbar: true,
            config: {
              defaultStyle: 'unordered'
            },
        },
        checklist: {
            class: Checklist,
            inlineToolbar: true,
        },
        embed: Embed,
        table: Table,
        delimiter: Delimiter,
        warning: Warning,
        code: CodeTool,
        raw: RawTool,
        // attaches: {
        //     class: AttachesTool,
        //     config: {
        //       endpoint: 'http://localhost:8008/uploadFile'
        //     }
        // },
        Marker: {
            class: Marker,
            // shortcut: 'CMD+SHIFT+M',
        },
        inlineCode: {
            class: InlineCode,
            // shortcut: 'CMD+SHIFT+M',
        },
    },
    
    data: JSON.parse(json)
})

function save() {
    editor.save().then((outputData) => {
        console.log('Save data: ', JSON.stringify(outputData));
        localStorage.setItem("notes",JSON.stringify(outputData))
    }).catch((error) => {
        console.log('Saving failed: ', error)
    });
}

document.addEventListener("keydown", function(e){
    if (e.ctrlKey && e.key == "s") {
        e.preventDefault();
        save()
    }
});

window.onbeforeunload = save;