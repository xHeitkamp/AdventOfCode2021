const fs = require('fs');

fs.readFile('Day4-Bingo.txt', 'utf8', (err, data) => {
	if (err) throw err;
	let { numbers, bingos } = extractData(data);
	for (let index = 0; index < numbers.length; index++) {
		const number = numbers[index];
		bingos = markAsPulled(number, bingos);
		if (hitBingo(number, bingos) === true) return;
	}
});

const nominateWinner = (number, bingo) => {
  let unmarkedNumbers = 0;
  let winnerBingo = [];

  //Get all unhit numbers
  for (let outerIndex = 0; outerIndex < bingo.length; outerIndex++) {
    const rows = bingo[outerIndex];
    winnerBingo.push(rows.map(ele => ele.number))
    for (let innerIndex = 0; innerIndex < rows.length; innerIndex++) {
      const element = bingo[outerIndex][innerIndex];
      if (element.pulled === false) unmarkedNumbers += element.number;
    }    
  }

  //Display bingo
  console.log('Winner bingo:');
  let outputBingo = "";
  bingo.forEach(row => {
    row.forEach(number => outputBingo += `${number.number} `)
    outputBingo += `\n`
  });
  console.log(outputBingo);

  const finalScore = unmarkedNumbers * number;
	console.log(`Number when bingo hit: ${number}`);
	console.log(`Sum of all unmarked numbers : ${unmarkedNumbers}`);
	console.log(`Final score: ${finalScore}`);
};

const hitBingo = (number, bingos) => {
	let results = {bingo: undefined, hit: false};
  bingos.forEach((bingo) => {
		let bongo = false;

		//Check rows
		bingo.forEach((row) => {
			let rowBongo = 0;
			row.forEach((obj) => {
				if (obj.pulled === true) rowBongo = rowBongo + 1;
			});
			if (rowBongo === row.length) bongo = true;
		});

		//Check columns
		let rowLength = bingo[0].length;
		for (let columnIndex = 0; columnIndex < rowLength; columnIndex++) {
			let columnBongo = 0;
			for (let rowIndex = 0; rowIndex < bingo.length; rowIndex++) {
				if (bingo[columnIndex][rowIndex].pulled === true)
					columnBongo = columnBongo + 1;
			}
			if (columnBongo === bingo.length) bongo = true;
		}

		if (bongo) {
      results.bingo = bingo;
      results.hit = true;
    };
	});
	if (results.hit) {
		nominateWinner(number, results.bingo);
		return true;
	} else return false;
};

const markAsPulled = (number, bingos) => {
	bingos.forEach((bingo) => {
		bingo.forEach((row) => {
			row.forEach((obj) => {
				if (obj.number === number) obj.pulled = true;
			});
		});
	});
	return bingos;
};

const extractData = (data) => {
	//Create Array of data
	data = data.split('\n\n');

	//Get number row as Ints and remove it from array
	const numbers = data[0].split(',').map(Number);
	data.shift();

	//Get Bingos and returns every number in bingo as object (number, pulled)
	let bingos = [];
	for (let index = 0; index < data.length; index++) {
		let bingo = [];
		const rows = data[index].split('\n');
		rows.forEach((data) => {
			let row = [];
			data = data.split(' ');
			data.forEach((number) =>
				row.push({ number: parseInt(number), pulled: false })
			);
			bingo.push(row);
		});
		bingos.push(bingo);
	}

	return {
		numbers: numbers,
		bingos: bingos,
	};
};

/*
On the other hand, it might be wise to try a different strategy: let the giant squid win.

You aren't sure how many bingo boards a giant squid could play at once, so rather than waste time counting its arms, the safe thing to do is to figure out which board will win last and choose that one. That way, no matter which boards it picks, it will win for sure.

In the above example, the second board is the last to win, which happens after 13 is eventually called and its middle column is completely marked. If you were to keep playing until this point, the second board would have a sum of unmarked numbers equal to 148 for a final score of 148 * 13 = 1924.

Figure out which board will win last. Once it wins, what would its final score be?
*/