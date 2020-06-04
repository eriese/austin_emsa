import { ios } from "tns-core-modules/application";
// import {EntityProperty} from "nativescript-ui-dataform";
const preferredDateFormat: string = "MM/dd/yyyy";

class Fixer {
	fixFunctions: object;

	constructor(fixFunctions: object) {
		this.fixFunctions = fixFunctions
	}
	fixEditor(editorType, editor) {
		this.fixFunctions[editorType] && this.fixFunctions[editorType](editor);
	}
}

const iosFixer = new Fixer({
	SegmentedEditor(editor) {

	},
	DatePicker(editor) {
		const dateFormatter = NSDateFormatter.alloc().init();
		dateFormatter.dateFormat = preferredDateFormat;
		editor.dateFormatter = dateFormatter;
	}
})

const androidFixer = new Fixer({
	SegmentedEditor(editor) {

	},
	DatePicker(editor) {
		const simpleDateFormat = new java.text.SimpleDateFormat(preferredDateFormat, java.util.Locale.US);
		editor.setDateFormat(simpleDateFormat);
	}
})

export default function formatFixes(args) {
	const entityProperty: EntityProperty = args.object.getPropertyByName(args.propertyName);

	if (entityProperty.editor === undefined) {
		return;
	}

	const editorType = entityProperty.editor.type;
	const fixer: Fixer = ios ? iosFixer : androidFixer;
	fixer.fixEditor(editorType, args.editor);
}

// editorSetupSliderAndroid(editor) {
// 		const coreEditor = <android.widget.SeekBar>editor.getEditorView();
// 		coreEditor.getThumb().setColorFilter(new android.graphics.PorterDuffColorFilter(colorDark.android, android.graphics.PorterDuff.Mode.SRC_IN));
// 		coreEditor.getProgressDrawable().setColorFilter(new android.graphics.PorterDuffColorFilter(colorLight.android, android.graphics.PorterDuff.Mode.SRC_IN));
// }

// editorSetupSliderIOS(editor) {
//     const coreEditor = <UISlider>editor.editor;
//     coreEditor.tintColor = colorLight.ios;
//     coreEditor.thumbTintColor = colorDark.ios;
// }
