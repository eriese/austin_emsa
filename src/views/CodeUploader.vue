<template>
	<div class="side-padded text-center">
		<h1 class="h1">App Store Codes</h1>
		<h2 class="h2">Codes remaining: {{numCodes}}</h2>
		<br>
		<p><a class="link" href="https://business.apple.com/#main/b2bapps">get more codes here</a></p>
		<br>
		<form @submit="submitCodes">
			<label for="codes">Enter new codes (each code should be on its own line)</label>
			<div class="side-padded">
				<textarea name="codes" id="codes" cols="30" rows="20" v-model="codes"></textarea>
			</div>
			<p>{{statusText}}</p>
			<input class="button" type="submit">
		</form>
	</div>
</template>

<script>
import ApiService from '../services/ApiService';

export default {
	name: 'CodeUploader',
	data() {
		return {
			numCodes: 'loading...',
			codes: '',
			statusText: ''
		}
	},
	methods: {
		submitCodes(e) {
			e.preventDefault && e.preventDefault();
			this.statusText = '';

			if (this.codes == '') {
				return;
			}

			this.statusText = 'submitting...';
			const codeList = this.codes.split('\n');
			ApiService.submitCodes(codeList).then((response) => {
				this.numCodes = response.data;
				this.statusText = 'successfully submitted codes';
			}).catch((error) => {
				this.statusText = error;
			})
		}
	},
	mounted() {
		ApiService.getCodesCount().then((count) => this.numCodes = count);
	}
}
</script>
