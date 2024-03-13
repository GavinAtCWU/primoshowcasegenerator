
function generateShowcase() {

	// Get Primo base URL and search parameters and initialize PNX search URL
	let primoSearchUrl = new URL(document.getElementById('primo_search_url').value);
	let primoPNXSUrl = primoSearchUrl.origin + '/primaws/rest/external/pnxs?';
	let searchParams = primoSearchUrl.search.split('&');
	searchParams[0] = searchParams[0].replace('?', '');

	// Validate / clean input
	let titleText = document.getElementById('showcase_title').value.trim();

	// Initialize facet parameters
	let qInclude = 'qInclude=';
	let qExclude = 'qExclude=';

	// Loop through Primo URL parameters and add parameters to PNX search URL
	for(let index in searchParams) {
		let components = searchParams[index].split('=');
		let param = components[0];
		let value = components[1];
		if(param == 'query') {
			param = 'q';
		}
		else if(param == 'search_scope') {
			param = 'scope';
		}
		else if(param == 'facet') {
			let valueParts = value.match(/^(.*),(.*),(.*)$/);
			let facetParam = valueParts[1];
			let facetType = valueParts[2];
			let facetValue = valueParts[3];
			if(facetType == 'include') {
				qInclude += 'facet_' + facetParam + ',exact,' + facetValue + '%7C,%7C';
			}
			else {
				qExclude += 'facet_' + facetParam + ',exact,' + facetValue + '%7C,%7C';
			}
			param = value = '';
		}
		primoPNXSUrl += param + '=' + value + '&';
	}

	// Trim last '%7C,%7C' off facet parameters and append to PNX search URL
	primoPNXSUrl += qInclude.replace(/%7C,%7C$/, '') + '&' + qExclude.replace(/%7C,%7C$/, '');
	console.log(primoPNXSUrl);

	// Add showcase element to showcase div and textarea and highlight text in textarea for copying
	let showcase = '<search-carousel ' +
		'titleText="' + titleText + '" ' +
		'titleLink="' + primoSearchUrl.href + '" ' +
		'searchUrl="' + primoPNXSUrl + '">' +
		'</search-carousel>';
	document.getElementById('showcase').innerHTML = showcase;
	document.getElementById('showcase_code').innerHTML = showcase;
	//document.getElementById('showcase_code').select();

}

function copyShowcaseCode() {
	let showcaseCode = document.getElementById('showcase_code');
	showcaseCode.select();
	navigator.clipboard.writeText(showcaseCode.value);
}
