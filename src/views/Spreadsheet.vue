<script>
	import EmsaPage from '../mixins/EmsaPage';
	import ApiService from '../services/ApiService';
	export default {
		name: 'Spreadsheet',
		mixins: [EmsaPage],
		data() {
			return {
				lines: [[]],
				search: ''
			}
		},
		computed: {
			rowCount() {
				return this.lines.length;
			},
			rows() {
				return this.rowCount ? '*' + (',*').repeat(this.rowCount - 1) : '*';
			},
			colCount() {
				return this.lines[0].length;
			},
			cols() {
				return this.colCount ? '*' + (',*').repeat(this.colCount - 1) : '*';
			},
			filteredLines() {
				if (!this.search || this.search.trim().length == 0) {return this.lines;}

				const search = this.search.toLowerCase();
				return this.lines.filter((line, i) => {
					return i === 0 || line.some((c) => {
						return c && c.value && c.value.toString().toLowerCase().includes(search);
					})
				});
			},
		},
		methods: {
			makeSelectable(e) {
				if (process.env.VUE_APP_PLATFORM == 'android') {
					e.object.nativeView.setTextIsSelectable(true);
				} else if (process.env.VUE_APP_PLATFORM == 'ios') {
					e.object.nativeView.isUserInteractionEnabled = true;
					// e.object.nativeView.setSelectionRange(0, 9999)
				}

				// e.object.();
			}
		},
		created: async function() {
			const sheet = await ApiService.getSpreadsheet('key_codes');
			this.lines = JSON.parse(sheet.lines);
		},
		render() {
			const isNative = process.env.VUE_APP_MODE == 'native';

			let cells = [];
			if (this.colCount) {
				cells = this.filteredLines.map((row, r) => {
					const rowCells = []
					row.forEach((cell, c) => {
						if (cell) {
							let el;

							if (isNative) {
								el = <Label text={cell.value} col={c} row={r} style={cell.style} textWrap="true" class="cell" rowSpan={cell.rowSpan} colSpan={cell.colSpan} onLoaded={this.makeSelectable}/>
							} else {
								let elType = r === 0 ? 'th' : 'td'
								el = <elType style={cell.style} colspan={cell.colSpan} rowspan={cell.rowspan} class="cell">{cell.value}</elType>
							}

							rowCells.push(el)
						}
					})
					return isNative ? rowCells : <tr>{rowCells}</tr>;
				})
			}

			if (isNative) {
				return <ScrollView>
					<StackLayout>
						<TitleAndBackButton text="Station Codes" onBackPressed={() => this.$emit('back')}/>
							<GridLayout columns="*,auto">
								<TextField text={this.search} colSpan="2" col="0" onTextChange={(e) => this.search = e.value} class="search-field"></TextField>
								<Label text={'\uf002'} class="fas cta--is-round" col="1"/>
							</GridLayout>
						<GridLayout columns={this.cols} rows={this.rows} class="sheet">
							{cells}
						</GridLayout>
					</StackLayout>
				</ScrollView>
			}

			return <div class="side-padded">
				<back-button/>
				<h1 class="h1 text-center">Station Codes</h1>
				<div class="search">
					<input type="text" vModel={this.search} class="search__field"/>
					<span class="fas fa-search pull-right search__icon"></span>
				</div>
				<table>
					{cells}
				</table>
			</div>
		}
	}
</script>

<style scoped lang="scss">
	.sheet {
		padding: 10;
	}

	.cell {
		border-bottom-width: 1;
		border-bottom-color: #ccc;
		border-bottom: 1px solid #ccc;
		padding: 5px;
		padding: 5 2;
	}

	.search {
		position: relative;

		&__field {
			width: 100%;
		}
		&__icon {
			position: absolute;
			right: 3px;
			top: 3px;
		}
	}

</style>
