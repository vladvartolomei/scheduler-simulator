import React from 'react';
import ReactDOM from 'react-dom';
import CSVReader from 'react-csv-reader'
import JsonTable from 'ts-react-json-table'
import {DateTime} from 'react-datetime-bootstrap'

import './index.css';

const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true
}

class JobsImporter extends React.Component {
    render() {
        let {display, onNext, handleCSVFile, handleCSVParseFailure, jsonData} = this.props;
        return (<>
            {display &&
            <div>
                <h2>Step 1: input jobs executions</h2>
                <div>
                    <CSVReader
                        cssClass="csv-reader-input"
                        label="Select CSV with jobs history"
                        onFileLoaded={handleCSVFile}
                        onError={handleCSVParseFailure}
                        parserOptions={papaparseOptions}
                        inputId="ObiWan"
                        inputStyle={{color: 'red'}}
                    />
                    <JsonTable
                        rows={jsonData.length > 0 ? jsonData : []}
                    />
                    <button onClick={onNext}>Next</button>
                </div>
            </div>
            }
        </>)
    }
}

class JobsStatsCurator extends React.Component {
    render() {
        let {
            display,
            onNext,
            onPrevious,
            fields,
            durationIx,
            jobIx,
            stageIx,
            onChangeDurationIdentifier,
            onChangeJobIdentifier,
            onChangeStageIdentifier
        } = this.props;
        return (<>
                {display &&
                <div>
                    <h2>Step 2: mark relevant KPIs & filter only the wanted jobs</h2>
                    <div>
                        <div>Duration field
                            <select
                                value={durationIx}
                                onChange={onChangeDurationIdentifier}
                            >
                                {fields.map(fieldName => <option key={fieldName} value={fieldName}>{fieldName}</option>)}
                            </select>
                        </div>
                        <div>Job Unique Key
                            <select
                                value={jobIx}
                                multiple={true}
                                onChange={onChangeJobIdentifier}
                            >
                                {fields.map(fieldName => <option key={fieldName} value={fieldName}>{fieldName}</option>)}
                            </select>
                        </div>
                        <div>Stage identifier
                            <select value={stageIx}
                                    multiple={true}
                                    onChange={onChangeStageIdentifier}>
                                {fields.map(fieldName => <option key={fieldName} value={fieldName}>{fieldName}</option>)}
                            </select>
                        </div>
                        <button onClick={onPrevious}>Back</button>
                        <button onClick={onNext}>Next</button>
                    </div>
                </div>}
            </>
        )
    }
}

class SimulationConfigurer extends React.Component {
    render() {
        let {display, onNext, onPrevious} = this.props;
        return (<>
                {display &&
                <div>
                    <h2>Step 3: define job groupings/parallelism/stages</h2>
                    <div>{/* define jobs groupings and constraints */}</div>
                    <button onClick={onPrevious}>Back</button>
                    <button onClick={onNext}>Next</button>
                </div>
                }
            </>
        )
    }
}

class ResultsDisplay extends React.Component {
    render() {
        let {display, onPrevious} = this.props;
        return (<>
                {display &&
                <div>
                    <h2>Step 4: Analyze results</h2>
                    <div>{/* show results chart and stats */}</div>
                    <DateTime/>
                    <button onClick={onPrevious}>Back</button>
                </div>
                }
            </>
        );
    }
}

class Scheduler extends React.Component {
    constructor(props) {
        super(props);
        //Step1
        this.handleCSVFile = this.handleCSVFile.bind(this);
        this.handleCSVParseFailure = this.handleCSVParseFailure.bind(this);

        //Step2
        this.onChangeDurationIdentifier = this.onChangeDurationIdentifier.bind(this)
        this.onChangeJobIdentifier = this.onChangeJobIdentifier.bind(this)
        this.onChangeStageIdentifier = this.onChangeStageIdentifier.bind(this)

        this.previousStep = this.previousStep.bind(this);
        this.nextStep = this.nextStep.bind(this);

        this.state = {
            //UI state
            displayStep: 1,
            //Data state
            jsonData: [],
            //Computation/Simulation state
            durationIx:"",
            jobIx:[],
            stageIx:[],
        };
    }

    //Step navigation
    previousStep() {
        this.setState({...this.state, displayStep: this.state.displayStep - 1})
    }

    nextStep() {
        this.setState(
            {...this.state, displayStep: this.state.displayStep + 1}
        )
    }

    //Step 1 control
    handleCSVFile(p) {
        this.setState({...this.state, jsonData: p});
    }

    handleCSVParseFailure() {
        console.log("Failed to parse");
    }

    //Step 2 control
    onChangeDurationIdentifier(event){
        console.log(event.target.value);
        this.setState({...this.state, durationIx:event.target.value});
    }
    onChangeJobIdentifier(event){
        console.log(event.target.value);
        this.setState({...this.state, jobIx:[...event.target.options].filter(o => o.selected).map(o => o.value) });
    }
    onChangeStageIdentifier(event){
        console.log(event.target.value)
        this.setState({...this.state, stageIx:[...event.target.options].filter(o => o.selected).map(o => o.value) });
    }

    render() {
        return (
            <div>
                <h1>Jobs schedule estimator</h1>
                <JobsImporter
                    handleCSVFile={this.handleCSVFile}
                    handleCSVParseFailure={this.handleCSVParseFailure}
                    jsonData={this.state.jsonData}
                    onNext={this.nextStep}
                    display={this.state.displayStep === 1}
                />
                <JobsStatsCurator
                    fields={ this.state.jsonData.length > 0 ? Object.keys(this.state.jsonData[0]) : [] }
                    onChangeDurationIdentifier={this.onChangeDurationIdentifier}
                    onChangeJobIdentifier={this.onChangeJobIdentifier}
                    onChangeStageIdentifier={this.onChangeStageIdentifier}
                    durationIx={this.state.durationIx}
                    jobIx={this.state.jobIx}
                    stageIx={this.state.stageIx}
                    onNext={this.nextStep}
                    onPrevious={this.previousStep}
                    display={this.state.displayStep === 2}
                />
                <SimulationConfigurer
                    onNext={this.nextStep}
                    onPrevious={this.previousStep}
                    display={this.state.displayStep === 3}
                />
                <ResultsDisplay
                    onPrevious={this.previousStep}
                    display={this.state.displayStep === 4}
                />
            </div>
        )
    }
}

ReactDOM.render(
    <Scheduler/>,
    document.getElementById('root')
);