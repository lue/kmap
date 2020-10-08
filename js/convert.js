var rawdata = `id,Node Type,title,Node Developer Notes,Parent Nodes in Context {1},Child Nodes in Context {1},Default Link,Application of Concept,Prerequisite,Conceptual Child,Conceptual Parent
1,Online Course,Probability Course,Course available at https://www.probabilitycourse.com/,{},{2},https://www.probabilitycourse.com/,{},{},,
2,Course L2 Substructure,1. Basic Concepts,First course section in https://www.probabilitycourse.com/,{1},{3},https://www.probabilitycourse.com/chapter1/1_0_0_introduction.php,{},,,
3,Course L3 Substructure,1.1 Introduction,,{2},{4},https://www.probabilitycourse.com/chapter1/1_0_0_introduction.php,{},,,
4,Course L4 Substructure,1.1.0 What is Probability?,,{3},{5},https://www.probabilitycourse.com/chapter1/1_1_0_what_is_probability.php,{},,,
5,Concept,Probability,,{4},{1},https://en.wikipedia.org/wiki/Probability,{11},,,
6,Concept,Fair Coin,,"{4,5}",{7},https://en.wikipedia.org/wiki/Fair_coin,{},,,
7,Online Video Resource,Brian Veitch Video on Tossing a Fair Coin,,{6},{},https://www.youtube.com/watch?v=5lpqiGixDd0,{},,,
8,Concept,Interpretations of probability,,{4},{9},https://en.wikipedia.org/wiki/Probability_interpretations,{},,,
9,Online Text Resource,Stanford Encyclopedia of Philosophy Entry on Interpretations of Probability,,{8},{},https://plato.stanford.edu/entries/probability-interpret/,{},,,
10,Course L4 Substructure,1.1.1 Example: Communication Systems,,{9},{11},https://www.probabilitycourse.com/chapter1/1_1_1_example.php,{},,,
11,Concept,Error Correcting Codes,,{10},{},https://en.wikipedia.org/wiki/Error_correction_code#Forward_error_correction,{},,,
12,Course L3 Substructure,1.2 Review of Set Theory,,{3},{19},https://www.probabilitycourse.com/chapter1/1_2_0_review_set_theory.php,{},,,
19,Course L4 Substructure,1.2.0 Review,,{12},"{13,14,15,16,17}",,,,,
13,Concept,Set Theory,,{12},,https://en.wikipedia.org/wiki/Set_theory,{},,"{15, 16, 17}",
14,Concept ,Natural Numbers,,{12},,https://en.wikipedia.org/wiki/Natural_number,{},,,
15,Concept,Basic Set Theory Notation,,{13},,https://www.mathsisfun.com/sets/symbols.html,{},,,{13}
16,Concept,Subset,,{13},,https://en.wikipedia.org/wiki/Subset,{},,,{13}
17,Concept,Universal Set,"The author uses the term ""Universal Set"" to refer to the sample space",{13},,https://en.wikipedia.org/wiki/Sample_space,{},,,{13}
18,Course L4 Substructure,1.2.1 Venn Diagrams,,{13},,https://www.probabilitycourse.com/chapter1/1_2_1_venn.php,{},,,
19,Concept,Venn Diagram,,{13},,https://en.wikipedia.org/wiki/Venn_diagram,{},,,
20,Course L4 Substructure,1.2.2 Set Operations,,{12},,https://www.probabilitycourse.com/chapter1/1_2_2_set_operations.php,{},,,
21,Concept,Set Operations,,{20},,https://en.wikipedia.org/wiki/Algebra_of_sets,{},,,{13}
22,Concept,Union,,{21},,https://en.wikipedia.org/wiki/Union_(set_theory),{},,,{21}
23,Concept,Intersection,,{21},,https://en.wikipedia.org/wiki/Intersection,{},,,{21}
24,Concept,Complement,,{21},,,,,,
25,Concept,Difference,,{21},,,,,,
26,Concept,De Morgan's Laws,,{21},,,,,,
27,Concept,Mutually Exclusive Events,,{21},,,,,,"{21,5}"
28,Concept,Cartesian Product,,{21},,,,,,`


// libabrary to parse CSV in string
var Papa = require('./papaparse.js');

function filterconvert (rawdata, nodetype) {
    var data = Papa.parse(rawdata, {header: true}).data;
    var i;
    var j;
    // create a list of ids that we display
    var filtered_ids = [];

    // This is a stupid filtering loop. Should be more sophisticated.
    for (i = 0; i < data.length; i++) {
        if (data[i]["Node Type"] == nodetype) {
            filtered_ids.push(data[i].id)
        } else {
            // filtered_ids.push(data[i].id)
        }
    }

    // print those ids
    console.log(filtered_ids)
    
    // empty list for the output
    var res = [];
    // now loop through all items again
    for (i = 0; i < data.length; i++) {
        // check that it is in filtered list
        if (filtered_ids.includes(data[i].id)) {
            console.log(data[i].id)

            // create a list of childs ids
            var child = data[i]['Child Nodes in Context {1}'];
            child = child.replace('{', '')
            child = child.replace('}', '')
            child = child.split(',')
            console.log(child)

            // create list in the new format
            // children != dependencies, but who cares...
            var depends = [];
            
            for (j = 0; j < child.length; j++) {
                if (child[j] != '') {
                    if (filtered_ids.includes(child[j])) {
                        depends.push({source: child[j], reason: ""})
                    }
                }
            }

            // console.log(depends)

            // add element in the correct format 
            res.push({id: data[i].id,
                title: data[i].title,
                summary: '',
                dependencies: depends
                })
        }
        
    }
    return res;
}

// process data and keep only "concepts"
// filtering is very starightforward right now, but it is eay to modify
jsonData = filterconvert(rawdata, "Concept")
console.log(jsonData)
// filterconvert(data, "Concept")


// Write file:
var fs = require('fs');
fs.writeFile("data/9ppl_demo.json", JSON.stringify(jsonData), function(err) {
    if (err) {
        console.log(err);
    }
});