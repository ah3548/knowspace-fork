package com.ks.util;

import static org.junit.Assert.*;

import java.util.Date;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

public class SQSTest {

	SQS s;
	
	@Before
	public void setUp() {
		s = new SQS("Test2");
	}
	
	@Test
	public void testExecute() {
		s.sendMessage("Testing " + new Date());
	}
	
	@After
	public void tearDown() {
		s.deleteQueue();
	}
}
