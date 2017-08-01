'use strict'
const dat = require('../main/datbase.js');
var loadPromotions = dat.loadPromotions;
var loadAllItems = dat.loadAllItems;
function newInputs(inputs){
	let arrInput = Array.from(inputs);
	for(let i in arrInput){
		if(arrInput[i].length != 10){
			arrInput[i] = arrInput[i].substr(0,10);
		}
	}
	let newInput = Array.from(new Set(arrInput));
	// console.log(newInput);
	let buyCollection = [];
	let temp;
	let count=0;
	for(let value of newInput){
		count = 0;
		temp = {};
		let inputArr = Array.from(inputs);
		for(let i in inputArr){
			 if(inputArr[i].substr(0,10) ==value){
			 	if(inputArr[i].length == 10) count++;
			 	else count += Number(inputArr[i].split('-')[1]);
			 }
			
			
		}
			temp.barcode = value;
			temp.amount = count;
			buyCollection.push(temp);
	
		
	}
	// console.log(buyCollection);
	return buyCollection;
}	
function allCollection(Collection,allItems){
	let buyCollection = Array.from(new Set(Collection));
	for(let i in buyCollection){
		for(let j in allItems){
			if(buyCollection[i].barcode == allItems[j].barcode){
				buyCollection[i].name = allItems[j].name;
				buyCollection[i].unit = allItems[j].unit;
				buyCollection[i].price = (allItems[j].price).toFixed(2);
				buyCollection[i].isSale = false;
			}
		}
	}
	let loads = loadPromotions();
	let barcodes = loads[0].barcodes;
	for(let i in buyCollection){
		for(let value of Array.from(barcodes)){
			if(buyCollection[i].barcode == value){
				buyCollection[i].isSale = true;
			}
		}
	}
	return buyCollection;
}

function printInventory(inputs){
	let allMoney=0;
	let saveMoney=0;
	let elseInput = newInputs(inputs);
	let allItems = loadAllItems();
	let buyCollection = allCollection(elseInput,allItems);
	let test = '';
	test += '***<没钱赚商店>购物清单***\n'
	let shop = Array.from(new Set(buyCollection));
	for(let i in shop){
		if(shop[i].isSale){
			shop[i].reactAmount = Math.ceil(shop[i].amount*2/3);
		}
		else  shop[i].reactAmount = shop[i].amount;
		allMoney += shop[i].reactAmount*shop[i].price;
	
		test += '名称：'+shop[i].name+'，数量：'+shop[i].amount+shop[i].unit+'，单价：'+shop[i].price+'(元)，小计：'+(shop[i].price*shop[i].reactAmount).toFixed(2)+'(元)\n';
	}
	test +='----------------------\n' ;
    test +='挥泪赠送商品：\n' ;
    for(let i in shop){
    	if(shop[i].isSale == true){
    		saveMoney += (shop[i].amount-shop[i].reactAmount)*shop[i].price;
    		test +='名称：'+shop[i].name+'，数量：'+(shop[i].amount-shop[i].reactAmount)+shop[i].unit+'\n';
    	}
    }
    test +='----------------------\n';
    let count=0;
    for(let i in shop){
    	count +=shop[i].reactAmount*shop[i].price; 
    }
    test += '总计：'+allMoney.toFixed(2)+'(元)\n';
	test +='节省：'+saveMoney.toFixed(2)+'(元)\n';
	test +='**********************';
	console.log(test);
}
module.exports = printInventory;