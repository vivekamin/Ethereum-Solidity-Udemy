pragma solidity ^0.4.0;

contract CampaignFactory {
    address[] public deployedCampaign;
    
    function createCampaign(uint minimum) public {
        
        address newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaign.push(newCampaign);
    }
    
    function getDeployedCampaigns() public view returns(address[]){
        return deployedCampaign;
    }
}


contract Campaign {
    struct Request{
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCounts;
        mapping (address => bool) approvals;
    }
    
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    Request[] public requests;
    uint public approversCount;
    
    modifier restricted(){
         require(msg.sender==manager);
         _;
    }
    
    function Campaign(uint minimum, address creator) public{
        manager = creator;
        minimumContribution = minimum;
    }
    
    function contribute() public payable{
        require(msg.value > minimumContribution);
        
        approvers[msg.sender] = true;
        
        approversCount++;
        
    }
    
    function createRequest(string description,uint value,address recipient) public restricted{
        
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCounts: 0
        });
        
        
        requests.push(newRequest);
        
        
       
    }
    
    function approveRequest (uint index) public{
        Request storage request = requests[index];
        
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);
        
        request.approvals[msg.sender] = true;
        request.approvalCounts++;
        
        
        
    }
    
    function finalizeRequest(uint index) public restricted{
        Request storage request = requests[index];
        
        require(request.approvalCounts > (approversCount / 2));
        require(!request.complete);
        
        request.recipient.transfer(request.value);
        request.complete = true;
        
        
       
    }
    
    
    
    
    
}