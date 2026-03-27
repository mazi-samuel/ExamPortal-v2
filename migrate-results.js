#!/usr/bin/env node

/**
 * Data Migration Utility
 * Helps migrate existing results to the new format with project scores
 * Run: node migrate-results.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const RESULTS_FILE = path.join(__dirname, 'data', 'results.json');
const BACKUP_FILE = path.join(__dirname, 'data', 'results-backup.json');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function readResults() {
    try {
        if (!fs.existsSync(RESULTS_FILE)) {
            console.log('❌ Results file not found');
            return null;
        }
        return JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8'));
    } catch (error) {
        console.log('❌ Error reading results:', error.message);
        return null;
    }
}

function writeResults(data) {
    try {
        fs.writeFileSync(RESULTS_FILE, JSON.stringify(data, null, 2));
        console.log('✅ Results saved successfully');
        return true;
    } catch (error) {
        console.log('❌ Error saving results:', error.message);
        return false;
    }
}

function createBackup(data) {
    try {
        fs.writeFileSync(BACKUP_FILE, JSON.stringify(data, null, 2));
        console.log('✅ Backup created');
        return true;
    } catch (error) {
        console.log('❌ Error creating backup:', error.message);
        return false;
    }
}

function migrateResults(results) {
    console.log('\n📊 Migrating results to new format...\n');
    
    let modified = 0;
    const migrated = results.map(result => {
        // Add project score field if it doesn't exist
        if (result.projectScore === undefined) {
            result.projectScore = undefined; // Will be filled in later
            modified++;
        }
        
        // Ensure finalScore includes project score
        if (result.projectScore !== undefined) {
            result.finalScore = (result.finalOver60 || 0) + result.projectScore;
        } else {
            result.finalScore = result.finalOver60 || 0;
        }
        
        // Recalculate percentage
        result.percentage = result.finalScore !== undefined 
            ? Math.round((result.finalScore / 100) * 100)
            : 0;
        
        // Recalculate letter grade
        const pct = result.percentage || 0;
        result.gradeLetter = pct >= 90 ? 'A' :
                           pct >= 80 ? 'B' :
                           pct >= 70 ? 'C' :
                           pct >= 60 ? 'D' : 'E';
        
        return result;
    });
    
    console.log(`✅ Migration complete: ${modified} records updated`);
    return migrated;
}

function displayStats(results) {
    const total = results.length;
    const withProject = results.filter(r => r.projectScore !== undefined).length;
    const pending = total - withProject;
    
    console.log('\n📈 Current Status:');
    console.log(`   Total Students: ${total}`);
    console.log(`   Scores Entered: ${withProject}`);
    console.log(`   Pending: ${pending}`);
    
    if (withProject > 0) {
        const avgScore = Math.round(
            results.filter(r => r.projectScore !== undefined)
                .reduce((sum, r) => sum + (r.percentage || 0), 0) / withProject
        );
        console.log(`   Average Score: ${avgScore}%`);
    }
}

function askQuestion(question) {
    return new Promise(resolve => {
        rl.question(question, resolve);
    });
}

async function main() {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║   ICT RESULTS MIGRATION UTILITY                        ║');
    console.log('║   Migrate existing results to new format with projects ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    
    const results = readResults();
    if (!results) {
        rl.close();
        return;
    }
    
    console.log(`📂 Found ${results.length} student results\n`);
    
    displayStats(results);
    
    console.log('\n⚠️  This operation will:');
    console.log('   1. Add project score fields (if missing)');
    console.log('   2. Recalculate final scores');
    console.log('   3. Create a backup of your current data');
    console.log('   4. Update the results file\n');
    
    const confirm = await askQuestion('Continue with migration? (yes/no): ');
    
    if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
        console.log('\n❌ Migration cancelled');
        rl.close();
        return;
    }
    
    // Create backup
    console.log('\n📦 Creating backup...');
    createBackup(results);
    
    // Migrate
    const migrated = migrateResults(results);
    
    // Write
    console.log('💾 Saving migrated results...');
    writeResults(migrated);
    
    // Display summary
    console.log('\n✨ Migration completed successfully!');
    
    displayStats(migrated);
    
    console.log('\n📝 Next steps:');
    console.log('   1. Open results-editor.html to enter project scores');
    console.log('   2. View results-report.html to see final reports');
    console.log('   3. Use the filter and search features to manage data\n');
    
    rl.close();
}

main().catch(error => {
    console.error('❌ Fatal error:', error);
    rl.close();
    process.exit(1);
});
