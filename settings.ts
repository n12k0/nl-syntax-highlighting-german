import { App, PluginSettingTab, Setting, debounce } from 'obsidian';
import NLSyntaxHighlightGermanPlugin from 'main';


export interface NLSyntaxHighlightPluginSettings {
	adjectiveEnabled: boolean,
	adjectiveColor: string,
	nounEnabled: boolean,
	nounColor: string,
	adverbEnabled: boolean,
	adverbColor: string,
	verbEnabled: boolean,
	verbColor: string,
	conjunctionEnabled: boolean,
	conjunctionColor: string,
	articleEnabled: boolean, // Added for articles
	articleColor: string,    // Added for articles
	classToApplyHighlightingTo: string,
	wordsToOverride: string,
	enabled: boolean,
}

export const DEFAULT_SETTINGS: NLSyntaxHighlightPluginSettings = {
	adjectiveEnabled: true,
	adjectiveColor: "#b97a0a",
	nounEnabled: true,
	nounColor: "#ce4924",
	adverbEnabled: true,
	adverbColor: "#c333a7",
	verbEnabled: true,
	verbColor: "#177eB8",
	conjunctionEnabled: true,
	conjunctionColor: "#01934e",
	articleEnabled: true, // Added for articles
	articleColor: "#3a3ad6", // Added for articles
	classToApplyHighlightingTo: "",
	wordsToOverride: "",
	enabled: true,
}


export class NLSyntaxHighlightSettingTab extends PluginSettingTab {
	plugin: NLSyntaxHighlightGermanPlugin;

	constructor(app: App, plugin: NLSyntaxHighlightGermanPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
			const {containerEl} = this;

			containerEl.empty();

			new Setting(containerEl)
			.setName("Aktiviert")
			.setDesc("Hebt die Wortarten hervor (an/aus)")
			.addToggle(toggle =>
					toggle.setValue(this.plugin.settings.enabled)
						.onChange(async (value) => {
							this.plugin.settings.enabled = value;
							await this.plugin.saveSettings();
							this.plugin.updateExtensionEnabled(value);
						}));


			new Setting(containerEl).setName("Wortarten").setHeading();

			const adjectives = new Setting(containerEl).setName("Adjektive");
			let adjectiveToggle:HTMLElement;

			adjectives.addToggle(toggle =>
				{
					adjectiveToggle = toggle.toggleEl;
					adjectiveToggle.parentElement?.parentElement?.prepend(adjectiveToggle);

					toggle.setValue(this.plugin.settings.adjectiveEnabled)
						.onChange(async (value) => {
							this.plugin.settings.adjectiveEnabled = value;
							await this.plugin.saveSettings();
							this.plugin.reloadStyle();
						})
				}
			);

			adjectives.addColorPicker(component => component
				.setValue(this.plugin.settings.adjectiveColor)
				.onChange(async (value) => {
					this.plugin.settings.adjectiveColor = value;
					await this.plugin.saveSettings();
					this.plugin.reloadStyle();
			}));



			const nouns = new Setting(containerEl).setName("Nomen");
			let nounToggle:HTMLElement;

			nouns.addToggle(toggle =>
				{
					nounToggle = toggle.toggleEl;
					nounToggle.parentElement?.parentElement?.prepend(nounToggle);

					toggle.setValue(this.plugin.settings.nounEnabled)
						.onChange(async (value) => {
							this.plugin.settings.nounEnabled = value;
							await this.plugin.saveSettings();
							this.plugin.reloadStyle();
						})
				}
			);

			nouns.addColorPicker(component => component
				.setValue(this.plugin.settings.nounColor)
				.onChange(async (value) => {
					this.plugin.settings.nounColor = value;
					await this.plugin.saveSettings();
					this.plugin.reloadStyle();
			}));



			const adverbs = new Setting(containerEl).setName("Adverbien");
			let adverbToggle:HTMLElement;

			adverbs.addToggle(toggle =>
				{
					adverbToggle = toggle.toggleEl;
					adverbToggle.parentElement?.parentElement?.prepend(adverbToggle);

					toggle.setValue(this.plugin.settings.adverbEnabled)
						.onChange(async (value) => {
							this.plugin.settings.adverbEnabled = value;
							await this.plugin.saveSettings();
							this.plugin.reloadStyle();
						})
				}
			);

			adverbs.addColorPicker(component => component
				.setValue(this.plugin.settings.adverbColor)
				.onChange(async (value) => {
					this.plugin.settings.adverbColor = value;
					await this.plugin.saveSettings();
					this.plugin.reloadStyle();
			}));



			const verbs = new Setting(containerEl).setName("Verben");
			let verbToggle:HTMLElement;

			verbs.addToggle(toggle =>
				{
					verbToggle = toggle.toggleEl;
					verbToggle.parentElement?.parentElement?.prepend(verbToggle);

					toggle.setValue(this.plugin.settings.verbEnabled)
						.onChange(async (value) => {
							this.plugin.settings.verbEnabled = value;
							await this.plugin.saveSettings();
							this.plugin.reloadStyle();
						})
				}
			);

			verbs.addColorPicker(component => component
				.setValue(this.plugin.settings.verbColor)
				.onChange(async (value) => {
					this.plugin.settings.verbColor = value;
					await this.plugin.saveSettings();
					this.plugin.reloadStyle();
			}));



			const conjunctions = new Setting(containerEl).setName("Konjunktionen");
			let conjunctionToggle:HTMLElement;

			conjunctions.addToggle(toggle =>
				{
					conjunctionToggle = toggle.toggleEl;
					conjunctionToggle.parentElement?.parentElement?.prepend(conjunctionToggle);

					toggle.setValue(this.plugin.settings.conjunctionEnabled)
						.onChange(async (value) => {
							this.plugin.settings.conjunctionEnabled = value;
							await this.plugin.saveSettings();
							this.plugin.reloadStyle();
						})
				}
			);

			conjunctions.addColorPicker(component => component
				.setValue(this.plugin.settings.conjunctionColor)
				.onChange(async (value) => {
					this.plugin.settings.conjunctionColor = value;
					await this.plugin.saveSettings();
					this.plugin.reloadStyle();
				}));



			const articles = new Setting(containerEl).setName("Artikel");
			let articleToggle:HTMLElement;

			articles.addToggle(toggle =>
				{
					articleToggle = toggle.toggleEl;
					articleToggle.parentElement?.parentElement?.prepend(articleToggle);

					toggle.setValue(this.plugin.settings.articleEnabled)
						.onChange(async (value) => {
							this.plugin.settings.articleEnabled = value;
							await this.plugin.saveSettings();
							this.plugin.reloadStyle();
						})
				}
			);

			articles.addColorPicker(component => component
				.setValue(this.plugin.settings.articleColor)
				.onChange(async (value) => {
					this.plugin.settings.articleColor = value;
					await this.plugin.saveSettings();
					this.plugin.reloadStyle();
			}));



			new Setting(containerEl).setName("Sonstiges").setHeading();

			new Setting(containerEl)
				.setName('Wörter überschreiben')
				.setDesc('Manchmal werden Wörter falsch klassifiziert. Hier kannst du Wörter überschreiben. Format: wort: wortart, jeweils eine Zeile pro Wort. Beispiel: schnell: adverb')
				.addTextArea(text => text
					.setValue(this.plugin.settings.wordsToOverride)
					.setPlaceholder(`schnell: adverb\nBaum: noun`)
					.onChange(async (value) => {
						this.plugin.settings.wordsToOverride = value;
						this.plugin.loadWordsToOverrideDict();

						this.plugin.reloadEditorExtensions();
						debounce(() => {
							this.plugin.reloadEditorExtensions();
						}, 1000);

						await this.plugin.saveSettings();
					}));


			new Setting(containerEl)
			.setName('CSS-Klasse für Syntaxhervorhebung')
			.setDesc('Wenn angegeben, wird die Syntaxhervorhebung nur auf Notizen angewendet, deren "cssclass"-Eigenschaft im YAML gleich dem angegebenen Wert ist.')
			.addText(text => text
				.setValue(this.plugin.settings.classToApplyHighlightingTo)
				.onChange(async (value) => {
					this.plugin.settings.classToApplyHighlightingTo = value;
					await this.plugin.saveSettings();
					this.plugin.reloadStyle();
				}));
		}
}
