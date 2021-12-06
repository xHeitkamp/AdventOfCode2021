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
You're already almost 1.5km (almost a mile) below the surface of the ocean, already so deep that you can't see any sunlight. What you can see, however, is a giant squid that has attached itself to the outside of your submarine.

Maybe it wants to play bingo?

Bingo is played on a set of boards each consisting of a 5x5 grid of numbers. Numbers are chosen at random, and the chosen number is marked on all boards on which it appears. (Numbers may not appear on all boards.) If all numbers in any row or any column of a board are marked, that board wins. (Diagonals don't count.)

The submarine has a bingo subsystem to help passengers (currently, you and the giant squid) pass the time. It automatically generates a random order in which to draw numbers and a random set of boards (your puzzle input). For example:

7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7
After the first five numbers are drawn (7, 4, 9, 5, and 11), there are no winners, but the boards are marked as follows (shown here adjacent to each other to save space):

22 13 17 11  0         3 15  0  2 22        14 21 17 24  4
 8  2 23  4 24         9 18 13 17  5        10 16 15  9 19
21  9 14 16  7        19  8  7 25 23        18  8 23 26 20
 6 10  3 18  5        20 11 10 24  4        22 11 13  6  5
 1 12 20 15 19        14 21 16 12  6         2  0 12  3  7
After the next six numbers are drawn (17, 23, 2, 0, 14, and 21), there are still no winners:

22 13 17 11  0         3 15  0  2 22        14 21 17 24  4
 8  2 23  4 24         9 18 13 17  5        10 16 15  9 19
21  9 14 16  7        19  8  7 25 23        18  8 23 26 20
 6 10  3 18  5        20 11 10 24  4        22 11 13  6  5
 1 12 20 15 19        14 21 16 12  6         2  0 12  3  7
Finally, 24 is drawn:

22 13 17 11  0         3 15  0  2 22        14 21 17 24  4
 8  2 23  4 24         9 18 13 17  5        10 16 15  9 19
21  9 14 16  7        19  8  7 25 23        18  8 23 26 20
 6 10  3 18  5        20 11 10 24  4        22 11 13  6  5
 1 12 20 15 19        14 21 16 12  6         2  0 12  3  7
At this point, the third board wins because it has at least one complete row or column of marked numbers (in this case, the entire top row is marked: 14 21 17 24 4).

The score of the winning board can now be calculated. Start by finding the sum of all unmarked numbers on that board; in this case, the sum is 188. Then, multiply that sum by the number that was just called when the board won, 24, to get the final score, 188 * 24 = 4512.

To guarantee victory against the giant squid, figure out which board will win first. What will your final score be if you choose that board?
*/