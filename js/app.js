// Main application logic
import { GeminiService } from './gemini-service.js';
import { Utils } from './utils.js';
import { Modal } from './modal.js';
import { config } from './config.js';

export class App {
    constructor() {
        console.log('=== App Constructor Starting ===');
        this.initializeElements();
        this.modal = new Modal();
        this.setupEventListeners();
        this.lastTranslatedConfig = '';
        console.log('=== App Constructor Complete ===');
    }

    initializeElements() {
        console.log('Initializing elements...');

        // Basic elements
        this.sourceConfigEl = document.getElementById('sourceConfig');
        this.sourceVendorEl = document.getElementById('sourceVendor');
        this.sourceOSTypeEl = document.getElementById('sourceOSType');
        this.targetVendorEl = document.getElementById('targetVendor');
        this.targetOSTypeEl = document.getElementById('targetOSType');
        this.translateButton = document.getElementById('translateButton');
        this.outputContainer = document.getElementById('outputContainer');
        this.aiFeaturesContainer = document.getElementById('aiFeatures');
        this.explainButton = document.getElementById('explainButton');
        this.testPlanButton = document.getElementById('testPlanButton');

        // Advanced settings elements
        this.toggleAdvancedBtn = document.getElementById('toggleAdvanced');
        this.advancedSettingsEl = document.getElementById('advancedSettings');
        this.advancedToggleTextEl = document.getElementById('advancedToggleText');
        this.modelSelectionEl = document.getElementById('modelSelection');
        this.modelDescriptionEl = document.getElementById('modelDescription');
        this.customPromptEl = document.getElementById('customPrompt');
        this.clearCustomPromptBtn = document.getElementById('clearCustomPrompt');
        this.customPromptLengthEl = document.getElementById('customPromptLength');

        console.log('Elements initialized:', {
            toggleAdvancedBtn: !!this.toggleAdvancedBtn,
            advancedSettingsEl: !!this.advancedSettingsEl,
            modelSelectionEl: !!this.modelSelectionEl,
            modelDescriptionEl: !!this.modelDescriptionEl,
            customPromptEl: !!this.customPromptEl,
            clearCustomPromptBtn: !!this.clearCustomPromptBtn,
            customPromptLengthEl: !!this.customPromptLengthEl
        });

        // Check if advanced settings are hidden by default
        if (this.advancedSettingsEl) {
            console.log('Advanced settings initially hidden:', this.advancedSettingsEl.classList.contains('hidden'));
        }
    }

    setupEventListeners() {
        this.translateButton.addEventListener('click', () => this.handleTranslate());
        this.explainButton.addEventListener('click', () => this.handleExplain());
        this.testPlanButton.addEventListener('click', () => this.handleTestPlan());

        // Advanced settings event listeners
        if (this.toggleAdvancedBtn) {
            this.toggleAdvancedBtn.addEventListener('click', () => this.toggleAdvancedSettings());
        } else {
            console.error('Toggle advanced button not found');
        }

        if (this.modelSelectionEl) {
            this.modelSelectionEl.addEventListener('change', () => this.updateModelDescription());
        }

        if (this.customPromptEl) {
            this.customPromptEl.addEventListener('input', () => this.updateCustomPromptLength());
        }

        if (this.clearCustomPromptBtn) {
            this.clearCustomPromptBtn.addEventListener('click', () => this.clearCustomPrompt());
        }

        // Add vendor change listeners for OS filtering
        this.sourceVendorEl.addEventListener('change', () => this.updateSourceOSOptions());
        this.targetVendorEl.addEventListener('change', () => this.updateTargetOSOptions());

        // Initialize advanced settings and OS filtering on load
        setTimeout(() => {
            this.initializeAdvancedSettings();
            this.updateSourceOSOptions();
            this.updateTargetOSOptions();
        }, 100);
    }

    async handleTranslate() {
        const sourceConfig = this.sourceConfigEl.value.trim();
        const sourceVendor = this.sourceVendorEl.value;
        const sourceOSType = this.sourceOSTypeEl.value;
        const targetVendor = this.targetVendorEl.value;
        const targetOSType = this.targetOSTypeEl.value;
        const selectedModel = this.modelSelectionEl.value;
        const customPrompt = this.customPromptEl.value.trim();

        console.log('Translation started with:', {
            sourceVendor,
            targetVendor,
            selectedModel,
            customPromptLength: customPrompt.length,
            sourceConfigLength: sourceConfig.length
        });

        if (!sourceConfig) {
            this.outputContainer.innerHTML = '<span class="text-red-400">Please enter a source configuration.</span>';
            return;
        }

        this.outputContainer.innerHTML = '<div class="loader"></div>';
        this.aiFeaturesContainer.classList.add('hidden');
        this.translateButton.disabled = true;
        this.translateButton.classList.add('opacity-50', 'cursor-not-allowed');

        try {
            console.log('Building translation prompt...');
            const systemPrompt = this.buildTranslationPrompt(sourceVendor, sourceOSType, targetOSType, customPrompt);
            const userQuery = this.buildTranslationQuery(sourceConfig, sourceVendor, sourceOSType, targetVendor, targetOSType);

            console.log('Calling AI with model:', selectedModel);
            const translatedConfig = await GeminiService.generateContent(systemPrompt, userQuery, selectedModel);
            const cleanedConfig = Utils.cleanApiResponse(translatedConfig);
            this.lastTranslatedConfig = cleanedConfig;

            this.outputContainer.textContent = cleanedConfig;
            this.aiFeaturesContainer.classList.remove('hidden');
            console.log('Translation completed successfully');
        } catch (error) {
            console.error("Error during translation:", error);
            this.outputContainer.innerHTML = `<span class="text-red-400 text-center">An error occurred while communicating with the AI. <br> ${error.message}</span>`;
        } finally {
            this.translateButton.disabled = false;
            this.translateButton.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }

    
    async handleExplain() {
        if (!this.lastTranslatedConfig) return;
        const targetVendor = this.targetVendorEl.value;
        const selectedModel = this.modelSelectionEl.value;
        const customPrompt = this.customPromptEl.value.trim();
        this.modal.open('Configuration Explanation');

        try {
            const systemPrompt = this.buildExplanationPrompt(customPrompt);
            const userQuery = `Explain the following ${targetVendor} configuration:\n\n${this.lastTranslatedConfig}`;

            const rawExplanation = await GeminiService.generateContent(systemPrompt, userQuery, selectedModel);
            const cleanedExplanation = Utils.cleanApiResponse(rawExplanation);
            this.modal.setContent(cleanedExplanation);
        } catch (error) {
            this.modal.setError(`Failed to generate explanation: ${error.message}`);
        }
    }

    async handleTestPlan() {
        if (!this.lastTranslatedConfig) return;
        const targetVendor = this.targetVendorEl.value;
        const selectedModel = this.modelSelectionEl.value;
        const customPrompt = this.customPromptEl.value.trim();
        this.modal.open('Generated Test Plan');

        try {
            const systemPrompt = this.buildTestPlanPrompt(customPrompt);
            const userQuery = `Generate a test plan for the following ${targetVendor} configuration:\n\n${this.lastTranslatedConfig}`;

            const rawTestPlan = await GeminiService.generateContent(systemPrompt, userQuery, selectedModel);
            const cleanedTestPlan = Utils.cleanApiResponse(rawTestPlan);
            this.modal.setContent(cleanedTestPlan);
        } catch (error) {
            this.modal.setError(`Failed to generate test plan: ${error.message}`);
        }
    }

    buildTranslationPrompt(sourceVendor = '', sourceOSType = '', targetOSType = '', customPrompt = '') {
        let contextInfo = '';
        if (sourceVendor) {
            contextInfo += ` The source configuration is from ${sourceVendor}.`;
        }
        if (sourceOSType) {
            contextInfo += ` The source OS is ${sourceOSType}.`;
        }
        if (targetOSType) {
            contextInfo += ` The target OS is ${targetOSType}.`;
        }

        let customPromptSection = '';
        if (customPrompt) {
            customPromptSection = `\n\nAdditional Instructions: ${customPrompt}`;
            console.log('Custom prompt included:', customPrompt.substring(0, 100) + '...');
        }

        const fullPrompt = `You are 'Gem Network Expert Translate', a highly specialized AI agent. Your sole purpose is to translate network device configurations. You have expert-level knowledge of multi-vendor syntax, including Cisco IOS, IOS-XE, IOS-XR, NX-OS, Juniper (Junos), Huawei (VRP), Aruba (AOS-CX), and Arista (EOS).${contextInfo}${customPromptSection}
Core Directives:
1. Analyze the source configuration and any corrective feedback provided by the user.
2. Translate the configuration into the target vendor's syntax with extreme accuracy.
3. **Critical Output Format**: Your response MUST BE ONLY the translated configuration code. Do not include any explanatory text, greetings, or markdown formatting like \`\`\`. The output must be pure, ready-to-use configuration code.
4. **Critical Formatting Requirements**: You MUST follow these exact formatting rules for each vendor:
   - **Cisco IOS/IOS-XE/NX-OS**: Use 1 space indentation for sub-commands under parent commands. Example format:
     interface Ethernet1/1
      description Uplink
      switchport mode trunk
      switchport trunk allowed vlan 10,20,30
   - **Arista EOS**: Use 3 spaces indentation for sub-commands. Example format:
     interface Ethernet1
        description Uplink
        switchport mode trunk
        switchport trunk allowed vlan 10,20,30
   - **Aruba AOS-CX**: Use 3 spaces indentation for sub-commands under interfaces. Example format:
     interface 1/1/1
        description Uplink
        no shutdown
        vlan trunk native 1
        vlan trunk allowed 10,20,30
   - **Huawei VRP**: Use 2 spaces indentation for sub-commands. Example format:
     interface GigabitEthernet0/0/1
      description Uplink
      port link-type trunk
      port trunk allow-pass vlan 10 20 30
   - **Juniper Junos**: Use hierarchical configuration with proper indentation in set format or brackets. Example:
     set interfaces ge-0/0/1 description "Uplink"
     set interfaces ge-0/0/1 unit 0 family ethernet-switching port-mode trunk
     set interfaces ge-0/0/1 unit 0 family ethernet-switching vlan members [10 20 30]
5. If a direct translation is impossible, embed a clear, concise comment within the code (e.g., "# [INFO] Manual configuration required for this feature").`;

        console.log('Translation prompt built, custom prompt length:', customPrompt.length);
        return fullPrompt;
    }

    buildExplanationPrompt(customPrompt = '') {
        let customPromptSection = '';
        if (customPrompt) {
            customPromptSection = `\n\nAdditional Context: ${customPrompt}`;
        }

        return `You are a senior network engineer and trainer. Your task is to provide a clear, step-by-step explanation for a given network configuration.${customPromptSection}
**Format your entire response using Markdown.** Use headings (e.g., '## Interface Configuration'), bullet points for explanations, and backticks for inline code (e.g., \`vlan 10\`) or triple backticks with a language specifier for code blocks.`;
    }

    buildTestPlanPrompt(customPrompt = '') {
        let customPromptSection = '';
        if (customPrompt) {
            customPromptSection = `\n\nAdditional Requirements: ${customPrompt}`;
        }

        return `You are a network automation engineer specializing in quality assurance. Your task is to create a concise but effective test plan to verify a network configuration.${customPromptSection}
**Format the entire response using Markdown, including tables for verification commands.**
For each part of the configuration, create a heading. Under each heading, list the specific verification commands (e.g., 'show' commands) and describe the expected output in a table to confirm success.`;
    }

    buildTranslationQuery(sourceConfig, sourceVendor = '', sourceOSType = '', targetVendor = '', targetOSType = '') {
        let query = `Translate the following network configuration to ${targetVendor}.`;

        if (sourceVendor) {
            query += ` The source configuration is from ${sourceVendor}.`;
        }
        if (sourceOSType) {
            query += ` The source OS is ${sourceOSType}.`;
        }
        if (targetOSType) {
            query += ` Use ${targetOSType} specific syntax and command structure for the target.`;
        }

        query += ` CRITICAL: You must follow the exact indentation and spacing rules specified for ${targetVendor} in the system prompt.`;
        query += ` The output formatting must match the examples provided in the formatting requirements exactly.`;

        query += `\n\n---\n${sourceConfig}\n---`;
        return query;
    }

    // Vendor-OS relationship data
    getVendorOSMapping() {
        return {
            'Cisco (IOS/IOS-XE)': ['IOS', 'IOS-XE', 'IOS-XR', 'NX-OS'],
            'Juniper (Junos)': ['Junos'],
            'Huawei (VRP)': ['VRP'],
            'Aruba (AOS-CX)': ['AOS-CX', 'AOS'],
            'Arista (EOS)': ['EOS']
        };
    }

    getAllOSTypes() {
        return ['IOS', 'IOS-XE', 'IOS-XR', 'NX-OS', 'Junos', 'VRP', 'AOS-CX', 'AOS', 'EOS'];
    }

    updateSourceOSOptions() {
        const selectedVendor = this.sourceVendorEl.value;
        const availableOS = this.getAvailableOSTypes(selectedVendor);

        // Clear current options
        this.sourceOSTypeEl.innerHTML = '';

        // Always add Auto-detect first
        const autoOption = document.createElement('option');
        autoOption.value = '';
        autoOption.textContent = 'Auto-detect';
        this.sourceOSTypeEl.appendChild(autoOption);

        // Add available OS types
        availableOS.forEach(osType => {
            const option = document.createElement('option');
            option.value = osType;
            option.textContent = this.getOSDisplayName(osType);
            this.sourceOSTypeEl.appendChild(option);
        });
    }

    updateTargetOSOptions() {
        const selectedVendor = this.targetVendorEl.value;
        const availableOS = this.getAvailableOSTypes(selectedVendor);

        // Clear current options
        this.targetOSTypeEl.innerHTML = '';

        // Always add Auto-detect first
        const autoOption = document.createElement('option');
        autoOption.value = '';
        autoOption.textContent = 'Auto-detect';
        this.targetOSTypeEl.appendChild(autoOption);

        // Add available OS types
        availableOS.forEach(osType => {
            const option = document.createElement('option');
            option.value = osType;
            option.textContent = this.getOSDisplayName(osType);
            this.targetOSTypeEl.appendChild(option);
        });
    }

    getAvailableOSTypes(vendor) {
        if (!vendor || vendor === '') {
            // If no vendor selected, return all OS types
            return this.getAllOSTypes();
        }

        const vendorOSMapping = this.getVendorOSMapping();
        const vendorOS = vendorOSMapping[vendor] || [];

        // Return only vendor-specific OS types
        return vendorOS;
    }

    getCommonOSTypes() {
        // Some OS types are common across vendors or used for specific purposes
        return ['IOS', 'IOS-XE', 'Junos']; // These are widely supported
    }

    isCommonOS(osType) {
        return this.getCommonOSTypes().includes(osType);
    }

    getOSDisplayName(osType) {
        const displayNames = {
            'IOS': 'Cisco IOS',
            'IOS-XE': 'Cisco IOS-XE',
            'IOS-XR': 'Cisco IOS-XR',
            'NX-OS': 'Cisco NX-OS',
            'Junos': 'Juniper Junos',
            'VRP': 'Huawei VRP',
            'AOS-CX': 'Aruba AOS-CX',
            'AOS': 'Aruba OS',
            'EOS': 'Arista EOS'
        };
        return displayNames[osType] || osType;
    }

    // Advanced Settings Methods
    initializeAdvancedSettings() {
        console.log('Initializing advanced settings...');
        console.log('Elements found:', {
            modelSelection: !!this.modelSelectionEl,
            customPrompt: !!this.customPromptEl,
            advancedSettings: !!this.advancedSettingsEl
        });

        this.populateModelSelection();
        this.updateModelDescription();
        this.updateCustomPromptLength();

        console.log('Advanced settings initialized');
    }

    toggleAdvancedSettings() {
        console.log('Toggle advanced settings clicked');

        if (!this.advancedSettingsEl) {
            console.error('Advanced settings element not found');
            return;
        }

        const isHidden = this.advancedSettingsEl.classList.contains('hidden');
        console.log('Current state - hidden:', isHidden);

        if (isHidden) {
            this.advancedSettingsEl.classList.remove('hidden');
            this.advancedToggleTextEl.textContent = 'Hide';
            this.toggleAdvancedBtn.innerHTML = '<span class="mr-1">▲</span>Hide';
            console.log('Showing advanced settings');
        } else {
            this.advancedSettingsEl.classList.add('hidden');
            this.advancedToggleTextEl.textContent = 'Show';
            this.toggleAdvancedBtn.innerHTML = '<span class="mr-1">▼</span>Show';
            console.log('Hiding advanced settings');
        }
    }

    populateModelSelection() {
        console.log('=== POPULATING MODEL SELECTION ===');

        if (!this.modelSelectionEl) {
            console.error('Model selection element not found');
            return;
        }

        // First try: Use service method
        try {
            const models = GeminiService.getAvailableModels();
            console.log('Models from service:', models);

            if (models && models.length > 0) {
                this.populateModelsFromList(models);
                return;
            }
        } catch (error) {
            console.error('Error getting models from service:', error);
        }

        // Fallback: Manually create models from config
        console.log('Using fallback manual model creation...');
        this.populateModelsManually();
    }

    populateModelsFromList(models) {
        console.log('Populating from list:', models);

        this.modelSelectionEl.innerHTML = '';

        models.forEach((model, index) => {
            console.log(`Adding model ${index}:`, model);
            const option = document.createElement('option');
            option.value = model.id;
            option.textContent = model.name;
            if (model.id === config.DEFAULT_MODEL) {
                option.selected = true;
            }
            this.modelSelectionEl.appendChild(option);
        });

        console.log('Model selection populated with', models.length, 'models');
        console.log('Current options count:', this.modelSelectionEl.options.length);
        console.log('Selected value:', this.modelSelectionEl.value);
    }

    populateModelsManually() {
        console.log('Manual population starting...');

        this.modelSelectionEl.innerHTML = '';

        // Manual model definitions - Latest models
        const manualModels = [
            { id: 'gemini-1.5-flash-002', name: 'Gemini 1.5 Flash (002) - Recommended' },
            { id: 'gemini-1.5-pro-002', name: 'Gemini 1.5 Pro (002) - Latest Stable' },
            { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro - Most Capable' },
            { id: 'gemini-1.5-pro-experimental', name: 'Gemini 1.5 Pro (Experimental)' },
            { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash - Fast & Efficient' },
            { id: 'gemini-1.5-flash-8b', name: 'Gemini 1.5 Flash (8B) - Ultra-Fast' },
            { id: 'gemini-exp-1206', name: 'Gemini Experimental (1206) - Latest' },
            { id: 'gemini-exp-1121', name: 'Gemini Experimental (1121)' }
        ];

        manualModels.forEach((model, index) => {
            console.log(`Adding manual model ${index}:`, model);
            const option = document.createElement('option');
            option.value = model.id;
            option.textContent = model.name;
            if (model.id === config.DEFAULT_MODEL) {
                option.selected = true;
                console.log('Set as default:', model.id);
            }
            this.modelSelectionEl.appendChild(option);
        });

        console.log('Manual population complete');
        console.log('Final options count:', this.modelSelectionEl.options.length);
        console.log('Final selected value:', this.modelSelectionEl.value);

        // Verify the options
        for (let i = 0; i < this.modelSelectionEl.options.length; i++) {
            console.log(`Option ${i}:`, this.modelSelectionEl.options[i].value, this.modelSelectionEl.options[i].textContent);
        }
    }

    updateModelDescription() {
        const selectedModelId = this.modelSelectionEl.value;
        const modelConfig = config.MODELS[selectedModelId];

        if (modelConfig) {
            this.modelDescriptionEl.textContent = modelConfig.description;
        } else {
            this.modelDescriptionEl.textContent = '';
        }
    }

    updateCustomPromptLength() {
        const length = this.customPromptEl.value.length;
        const maxLength = 2000;

        this.customPromptLengthEl.textContent = `${length} / ${maxLength} characters`;

        if (length > maxLength) {
            this.customPromptLengthEl.classList.add('text-red-400');
            this.customPromptLengthEl.classList.remove('text-gray-500');
            this.customPromptEl.value = this.customPromptEl.value.substring(0, maxLength);
        } else {
            this.customPromptLengthEl.classList.remove('text-red-400');
            this.customPromptLengthEl.classList.add('text-gray-500');
        }
    }

    clearCustomPrompt() {
        this.customPromptEl.value = '';
        this.updateCustomPromptLength();
    }

    // Manual test function - call from browser console: window.testApp()
    static testFromConsole() {
        console.log('=== Manual Test Started ===');

        // Check if config is available
        if (typeof config !== 'undefined') {
            console.log('Config available:', !!config);
            console.log('Models:', Object.keys(config.MODELS));
        } else {
            console.error('Config not available');
        }

        // Check if elements exist
        const modelSelect = document.getElementById('modelSelection');
        const advancedSettings = document.getElementById('advancedSettings');
        const toggleBtn = document.getElementById('toggleAdvanced');

        console.log('DOM Elements found:', {
            modelSelect: !!modelSelect,
            advancedSettings: !!advancedSettings,
            toggleBtn: !!toggleBtn
        });

        if (modelSelect) {
            console.log('Current options in modelSelect:', modelSelect.options.length);
            console.log('Current value:', modelSelect.value);
        }

        if (toggleBtn) {
            console.log('Toggle button found, trying to click...');
            toggleBtn.click();
            setTimeout(() => {
                console.log('Advanced settings visible:', !advancedSettings.classList.contains('hidden'));
            }, 100);
        }

        console.log('=== Manual Test Complete ===');
    }
}

// Make test function available globally
window.testApp = () => App.testFromConsole();

// Manual model population function - call from browser console: window.populateModels()
window.populateModels = () => {
    const modelSelect = document.getElementById('modelSelection');
    if (modelSelect) {
        console.log('Manual model population called');
        const app = new App();
        app.populateModelSelection();
    } else {
        console.error('Model selection element not found');
    }
};